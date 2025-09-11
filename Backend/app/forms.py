from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, DateTimeField
from wtforms.validators import Email, DataRequired, Length

class MemberForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=120)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    role = StringField('Role', validators=[DataRequired(), Length(min=2, max=64)])
    submit = SubmitField('Submit')
    
    
class EventForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=140)])
    description = TextAreaField('Description', validators=[Length(max=500)])
    date = DateTimeField('Date', format='%Y-%m-%dT%H:%M:%S', validators=[DataRequired()])
    event_type = StringField('Event Type', validators=[Length(max=50)])
    submit = SubmitField('Submit')