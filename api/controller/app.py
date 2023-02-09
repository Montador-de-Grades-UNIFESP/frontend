from flask import Flask, request
from service.modeling import Modeling
from flask_cors import CORS
from flask_cors import cross_origin
import json

app = Flask(__name__)
ucs = Modeling()
CORS(app)

class Grade():

    @app.route("/disciplinas", methods=['GET'])
    def get():
        return json.dumps(ucs.get_ucs())

    @app.route("/disciplinas", methods=['POST'])
    def post():
        data = request.get_json()
        data = data['items']
        return json.dumps(ucs.uc_analizer(data))

    def start(debug=False):
        return app.run(debug=debug)