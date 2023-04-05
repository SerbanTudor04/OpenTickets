python3 -m venv "./venv_build"

source venv_build\bin\activate &&      \   
    pip3 install -r raw/requirements.txt &&       \
    cd raw && \
    pyinstaller --onefile -F install.py  &&       \
    pyinstaller --onefile -F create_admin_user.py  && \
    cd ..
    #mv dist/* ../bin/ && cp -Rf sql ../bin/sql
mkdir -p bin/output
mkdir -p bin/sql
mv raw/dist/* bin
cp -Rf raw/sql/* bin/sql
