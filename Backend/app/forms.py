# from flask_wtf import FlaskForm
# from wtforms import StringField, SubmitField, TextAreaField, DateTimeField, PasswordField
# from wtforms.validators import Email, DataRequired, Length, EqualTo
# from app import csrf

# class MemberForm(FlaskForm):
#     role = StringField('Role', validators=[DataRequired(), Length(min=2, max=64)])
#     submit = SubmitField('Submit')
    

# class RegistrationForm(FlaskForm):
#     class Meta:
#         csrf = False
        
#     username = StringField('Username', validators=[DataRequired(), Length(min=3, max=64)])
#     email = StringField('Email', validators=[DataRequired(), Email()])
#     password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
#     confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
