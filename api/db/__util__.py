def assert_list(_type: type, l: list):
    for elem in l:
        assert type(elem) == _type
