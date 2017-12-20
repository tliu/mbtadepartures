import csv
import requests
import time
from flask import Flask
from flask import jsonify

URL = "http://developer.mbta.com/lib/gtrtfs/Departures.csv"

app = Flask(__name__)

@app.route("/trips")
def trips():
    with requests.Session() as s:
        trips = []
        result = s.get(URL)
        decoded = result.content.decode("utf-8")
        reader = csv.reader(decoded.splitlines(), delimiter = ",")
        data = list(reader)
        keys = map(lambda x: x.lower(), data[0])

        for row in data[1:]:
            d = dict(zip(keys, row)) 
            trips.append(d)

        response = jsonify(trips)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response


if __name__ == "__main__":
    app.run()


