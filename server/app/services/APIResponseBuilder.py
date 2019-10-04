from app import db
from flask import jsonify


class APIResponseBuilder:
    @staticmethod
    def success(data=None):
        """
        Builds a JSEND success response with included data

        :param data: dict type, payload to be returned.
        :return: JSON object
        """
        data_dict = {}
        for k, v in data.items():
            if type(v) == list and issubclass(type(v[0]), db.Model):
                data_dict[k] = [row.serialize() for row in v]
            else:
                data_dict[k] = v
        return jsonify({
            'status': 'success',
            'data': data_dict
        })

    @staticmethod
    def error(data=None):
        pass

    @staticmethod
    def failure(data=None):
        pass
