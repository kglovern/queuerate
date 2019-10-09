
class AuthenticationService:
    @staticmethod
    def uuid_match(token_uuid, entity_uuid):
        if token_uuid == entity_uuid:
            return True
        return False

    @staticmethod
    def is_valid_token(token):
        # TODO: validate token against firebase - how to do
        # This will always return true for now
        return True

    @staticmethod
    def has_permission_to_modify_object(token, entity_uuid):
        if AuthenticationService.is_valid_token(token) and AuthenticationService.uuid_match(token['sub'], entity_uuid):
            return True
        return False
