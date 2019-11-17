from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origin": "http://localhost:8081"}})
app.config.from_object('config')

# Database configuration
db = SQLAlchemy(app)
migrate = Migrate(app, db)
# import models so the migration util will pick them up
from app import models

# Module imports - for registering blueprints
from app.category.controllers import category_controller as category_module
from app.keyword.controllers import keyword_controller as keyword_module
from app.user.controllers import user_controller as user_module
from app.forwarding_settings.controllers import fs_controller as fs_module
from app.link.controllers import link_controller as link_module
from app.RelevantKeywords.controllers import rk_controller as rk_module

main = Blueprint("main", __name__)


@main.route('/')
def index():
    """
    Landing page for the user - TODO remove or replace this
    :return:
    """
    return "Hello World"


app.register_blueprint(main, url_prefix='/')
app.register_blueprint(category_module, url_prefix='/categories')
app.register_blueprint(keyword_module, url_prefix='/keywords')
app.register_blueprint(user_module, url_prefix='/users')
app.register_blueprint(fs_module, url_prefix='/forwarding_settings')
app.register_blueprint(link_module, url_prefix='/links')
app.register_blueprint(rk_module, url_prefix='/relevant_keywords')
