from .extensions import db
from datetime import datetime
import uuid

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    presentations = db.relationship('Presentation', backref='owner', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"User('{self.email}')"

class Presentation(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(150), nullable=False, default="Новая презентация")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    thumbnail_url = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    slides = db.relationship('Slide', backref='presentation', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"Presentation('{self.title}', Owner: '{self.owner.email}')"

class Slide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=True)
    content = db.Column(db.Text, nullable=True)
    slide_number = db.Column(db.Integer, nullable=False)
    background_color = db.Column(db.String(7), nullable=False, default='#FFFFFF')
    presentation_id = db.Column(db.String(36), db.ForeignKey('presentation.id'), nullable=False)

    def __repr__(self):
        return f"Slide(#{self.slide_number} in Presentation ID: {self.presentation_id})"