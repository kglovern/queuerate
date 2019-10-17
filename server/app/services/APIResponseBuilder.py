from app import db
from flask import jsonify, make_response
import builtins


class APIResponseBuilder:
    @staticmethod
    def success(data=None):
        """
        Builds a JSEND success response with included data
        Serializes any lists of

        :param data: dict type, payload to be returned.
        :return: JSON response
        """
        data_dict = APIResponseBuilder.serialize_data(data)

        return jsonify({
            'status': 'success',
            'data': data_dict
        })

    @staticmethod
    def error(msg="No error message specified"):
        """
        Generates a JSEND error response

        :param msg: message to be displayed as the error
        :return: JSON response, 500 status code
        """
        return make_response(jsonify({
            'status': 'error',
            'message': msg
        }), 500)


    @staticmethod
    def failure(data=None):
        """
        Generates a JSEND fail response

        :param data: dict type, payload to be returned
        :return: JSON response, 400 status code
        """
        data_dict = APIResponseBuilder.serialize_data(data)
        return make_response(jsonify({
            'status': 'fail',
            'data': data_dict
        }), 400)

    @staticmethod
    def serialize_data(data=None):
        """
        Serializes the passed data into a single object to be returned.

        Sanitizes model objects into iterable format

        :param data: dict type, data to be serialized
        :return: dict of serialized data
        """
        data_dict = {}
        if type(data) == dict:
            for k, v in data.items():
                if isinstance(v, builtins.list) and len(v) > 0 and issubclass(type(v[0]), db.Model):
                    data_dict[k] = [row.serialized for row in v]
                elif isinstance(v, db.Model):
                    data_dict[k] = v.serialized
                else:
                    data_dict[k] = v
        return data_dict
