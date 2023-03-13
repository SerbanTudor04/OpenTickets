from cx_Freeze import setup, Executable

includefiles = ["env.json"]
includes = []
excludes = ["tkinter", "PyQt4.QtSql", "sqlite3",
            "scipy.lib.lapack.flapack",
            "PyQt4.QtNetwork",
            "PyQt4.QtScript",
            "numpy.core._dotblas",
            "PyQt5"]

setup(
    name='Open Tickets',
    version='0.5',
    description='support apps',
    author='SerbanTudor04',
    author_email='tudor.gabriel.serban@gmail.com',
    options={'build_exe': {'excludes': excludes, 'include_files': includefiles}},
    executables=[Executable('server.py')]
)
