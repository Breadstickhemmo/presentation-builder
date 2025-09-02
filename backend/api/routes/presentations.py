from functools import wraps
from flask import request, jsonify, Blueprint, current_app, g, send_file
import jwt
import io
from pptx import Presentation as PptxPresentation
from pptx.util import Inches, Pt
from ..models import User, Presentation, Slide
from ..extensions import db

presentations_bp = Blueprint('presentations', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'authorization' in request.headers: token = request.headers['authorization'].split(' ')[1]
        if not token: return jsonify({'message': 'Токен аутентификации отсутствует'}), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            g.current_user = User.query.get(data['user_id'])
            if not g.current_user: return jsonify({'message': 'Пользователь не найден'}), 401
        except: return jsonify({'message': 'Недействительный токен'}), 401
        return f(*args, **kwargs)
    return decorated

@presentations_bp.route('/presentations/<string:presentation_id>/download', methods=['GET'])
@token_required
def download_presentation(presentation_id):
    presentation = Presentation.query.get_or_404(presentation_id)
    if presentation.user_id != g.current_user.id: return jsonify({'message': 'Доступ запрещен'}), 403
    prs = PptxPresentation()
    prs.slide_width = Inches(16); prs.slide_height = Inches(9)
    slides = Slide.query.filter_by(presentation_id=presentation.id).order_by(Slide.slide_number).all()
    for slide_data in slides:
        slide = prs.slides.add_slide(prs.slide_layouts[6])
        if slide_data.title:
            txBox = slide.shapes.add_textbox(Inches(1), Inches(1), Inches(14), Inches(1.5))
            p = txBox.text_frame.paragraphs[0]; p.text = slide_data.title; p.font.size = Pt(44); p.font.bold = True
        if slide_data.content:
            txBox = slide.shapes.add_textbox(Inches(1), Inches(2.5), Inches(14), Inches(5.5))
            tf = txBox.text_frame; tf.text = slide_data.content; tf.paragraphs[0].font.size = Pt(28)
    file_stream = io.BytesIO(); prs.save(file_stream); file_stream.seek(0)
    return send_file(file_stream, as_attachment=True, download_name=f"{presentation.title}.pptx", mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation')

@presentations_bp.route('/presentations', methods=['POST'])
@token_required
def create_presentation():
    data = request.get_json()
    title = data.get('title', 'Новая презентация')
    new_presentation = Presentation(title=title, owner=g.current_user)
    db.session.add(new_presentation)
    db.session.flush()
    first_slide = Slide(slide_number=1, presentation_id=new_presentation.id, title="Ваш заголовок")
    db.session.add(first_slide)
    db.session.commit()
    return jsonify({
        'id': new_presentation.id,
        'title': new_presentation.title,
        'updated_at': new_presentation.updated_at.isoformat(),
        'first_slide': {'id': first_slide.id, 'title': first_slide.title, 'content': first_slide.content}
    }), 201

@presentations_bp.route('/presentations', methods=['GET'])
@token_required
def get_presentations():
    presentations = Presentation.query.filter_by(user_id=g.current_user.id).order_by(Presentation.updated_at.desc()).all()
    output = []
    for p in presentations:
        first_slide = Slide.query.filter_by(presentation_id=p.id, slide_number=1).first()
        output.append({
            'id': p.id,
            'title': p.title,
            'updated_at': p.updated_at.isoformat(),
            'first_slide': {
                'id': first_slide.id,
                'title': first_slide.title,
                'content': first_slide.content
            } if first_slide else None
        })
    return jsonify(output), 200

@presentations_bp.route('/presentations/<string:presentation_id>', methods=['GET'])
@token_required
def get_presentation_by_id(presentation_id):
    presentation = Presentation.query.get_or_404(presentation_id)
    if presentation.user_id != g.current_user.id: return jsonify({'message': 'Доступ запрещен'}), 403
    slides = Slide.query.filter_by(presentation_id=presentation.id).order_by(Slide.slide_number).all()
    slides_output = [{'id': s.id, 'title': s.title, 'content': s.content, 'slide_number': s.slide_number, 'background_color': s.background_color} for s in slides]
    return jsonify({'id': presentation.id, 'title': presentation.title, 'slides': slides_output}), 200

@presentations_bp.route('/presentations/<string:presentation_id>', methods=['DELETE'])
@token_required
def delete_presentation(presentation_id):
    presentation = Presentation.query.get_or_404(presentation_id)
    if presentation.user_id != g.current_user.id: return jsonify({'message': 'Доступ запрещен'}), 403
    db.session.delete(presentation)
    db.session.commit()
    return jsonify({'message': 'Презентация успешно удалена'}), 200

@presentations_bp.route('/presentations/<string:presentation_id>', methods=['PUT'])
@token_required
def update_presentation(presentation_id):
    presentation = Presentation.query.get_or_404(presentation_id)
    if presentation.user_id != g.current_user.id: return jsonify({'message': 'Доступ запрещен'}), 403
    
    data = request.get_json()
    if 'title' in data:
        presentation.title = data['title']
    db.session.commit()

    first_slide = Slide.query.filter_by(presentation_id=presentation.id, slide_number=1).first()
    
    return jsonify({
        'id': presentation.id,
        'title': presentation.title,
        'updated_at': presentation.updated_at.isoformat(),
        'first_slide': {
            'id': first_slide.id,
            'title': first_slide.title,
            'content': first_slide.content
        } if first_slide else None
    }), 200