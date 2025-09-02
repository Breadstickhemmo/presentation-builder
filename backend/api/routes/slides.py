from flask import request, jsonify, Blueprint, g
from ..models import Presentation, Slide
from ..extensions import db
from .presentations import token_required

slides_bp = Blueprint('slides', __name__)

@slides_bp.route('/presentations/<string:presentation_id>/slides', methods=['POST'])
@token_required
def add_slide(presentation_id):
    presentation = Presentation.query.get_or_404(presentation_id)
    if presentation.user_id != g.current_user.id:
        return jsonify({'message': 'Доступ запрещен'}), 403

    max_slide_number = db.session.query(db.func.max(Slide.slide_number)).filter_by(presentation_id=presentation.id).scalar() or 0
    
    new_slide = Slide(
        title="Новый слайд",
        slide_number=max_slide_number + 1,
        presentation_id=presentation.id
    )
    db.session.add(new_slide)
    db.session.commit()

    return jsonify({
        'id': new_slide.id,
        'title': new_slide.title,
        'content': new_slide.content,
        'slide_number': new_slide.slide_number
    }), 201

@slides_bp.route('/slides/<int:slide_id>', methods=['PUT'])
@token_required
def update_slide(slide_id):
    slide = Slide.query.get_or_404(slide_id)
    presentation = Presentation.query.get(slide.presentation_id)

    if presentation.user_id != g.current_user.id:
        return jsonify({'message': 'Доступ запрещен'}), 403

    data = request.get_json()
    slide.title = data.get('title', slide.title)
    slide.content = data.get('content', slide.content)
    
    presentation.updated_at = db.func.now()
    db.session.commit()

    return jsonify({'message': 'Слайд успешно обновлен'}), 200

@slides_bp.route('/slides/<int:slide_id>', methods=['DELETE'])
@token_required
def delete_slide(slide_id):
    slide = Slide.query.get_or_404(slide_id)
    presentation = Presentation.query.get(slide.presentation_id)

    if presentation.user_id != g.current_user.id:
        return jsonify({'message': 'Доступ запрещен'}), 403
    
    if Slide.query.filter_by(presentation_id=presentation.id).count() <= 1:
        return jsonify({'message': 'Нельзя удалить последний слайд'}), 400

    db.session.delete(slide)
    db.session.commit()

    return jsonify({'message': 'Слайд успешно удален'}), 200