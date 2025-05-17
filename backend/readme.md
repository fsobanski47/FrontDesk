# Backend 
Baza danych - MySQL Server

API - FastAPI


## Jak to obsłużyć

### Stawianie serwera MySQL
Pobieramy serwer MySQL. Ja używam Dockera na linuxie i jest to mega proste, nie wiem jak zrobić to na windowsie. Trzeba utworzyć strukturę bazy (tabele). Za pomocą np. DBeaver łączymy się z bazą i uruchamiamy skrypt `build`. Dalej, żeby wrzucić jakieś przykładowe dane do bazy uruchamiamy skrypt `populate`. Ja wystawiłem na moim serwerze który jest odpalony 24/7 serwer i mozna sie tam podlaczyc po prostu:
<pre>
user: root
pass: aleksanderthegreat
ip: vpn.koteczek.uk
port: 21370
</pre>
Pierwszy skrypt można pominąć; tabele potrafi stworzyć `sqlalchemy`, ale w pliku `main.py` trzeba odkomentować linijkę:
<pre>#models.Base.metadata.create_all(bind=engine)
</pre>
Jeśli chodzi o przykładowe dane, to ten skrypt trzeba uruchomić, bo on tworzy np. słowniki statusów.

### Odpalenie backendu
1.  Najpierw: w folderze `backend` wywołać komendy:

    <pre>
    python3 -m venv venv_hotel
    source venv_hotel/bin/activate
    pip install -r hotel_api/requirements.txt
    </pre>
2. Serwer z api uruchamiamy komendą
    <pre>uvicorn hotel_api.main:app --reload</pre>
3. Pod linkiem [localhost:8000](localhost:8000) mamy wystawione endpointy api. Pod [localhost:8000/docs](localhost:8000/docs) jest instancja swaggera i można sobie testować.
