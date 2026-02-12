from xlwings import func


@func
def hello(name):
    return f"Hello {name}!"


@func
def hello2(name):
    return f"Hello {name}!"
