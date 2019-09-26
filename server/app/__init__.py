from flask import Flask, Blueprint


app = Flask(__name__)
app.config.from_object('config')

main = Blueprint("main", __name__)


@main.route('/')
def index():
    """
    Landing page for the user
    :return:
    """
    return "Hello World"


app.register_blueprint(main, url_prefix='/')