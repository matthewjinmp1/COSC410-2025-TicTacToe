import nox

@nox.session(python="3.12")
def lint(session):
    session.install(".[dev]")
    session.run("ruff", "check", ".")
    session.run("ruff", "format", "--check", ".")

@nox.session(python="3.12")
def typecheck(session):
    session.install(".[dev]")
    session.run("pyright")

@nox.session(python="3.12")
def tests(session):
    session.install(".[dev]")
    session.run("pytest")

@nox.session
def lint(session):
    session.install("ruff>=0.6")
    session.run("ruff", "check", ".")

@nox.session
def typecheck(session):
    session.install("mypy")
    session.run("mypy", "src", "tests")

@nox.session(python="3.12", venv_backend="uv")
def tests(session):
    session.install("pytest")
    session.install("-e", ".")
    session.run("pytest", "-q")

