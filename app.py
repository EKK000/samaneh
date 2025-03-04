from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

# Initialize the Flask application
app = Flask(__name__)

# Configure the database URI
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = (
    False  # Turn off modification tracking for better performance
)

# Initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)


# Define models
class Location(db.Model):
    __tablename__ = "location"
    id = db.Column(db.Integer, primary_key=True, index=True)
    address = db.Column(db.String(255), nullable=False)
    hourly_fee = db.Column(db.Float, nullable=False)
    daily_fee = db.Column(db.Float, nullable=False)
    main_image_path = db.Column(db.String(255))
    images = db.relationship("LocationImage", back_populates="location")


class LocationImage(db.Model):
    __tablename__ = "location_images"
    id = db.Column(db.Integer, primary_key=True, index=True)
    location_id = db.Column(
        db.Integer, db.ForeignKey("location.id"), nullable=False, index=True
    )
    path = db.Column(db.String(255), nullable=False)
    location = db.relationship("Location", back_populates="images")


# Route to display locations
@app.route("/")
def index():
    locations = Location.query.all()
    return render_template("index.html", locations=locations)


# Route for reservation page
@app.route("/reservation/<int:location_id>")
def reservation(location_id):
    location = Location.query.get_or_404(location_id)
    return render_template("reservation.html", location=location)


# Route to confirm reservation
@app.route("/confirm_reservation/<int:location_id>", methods=["POST"])
def confirm_reservation(location_id):
    # Process the reservation here (e.g., save to database, send email)
    return render_template("payment.html")


@app.route("/success/", methods=["POST"])
def success():
    # Process the reservation here (e.g., save to database, send email)
    return render_template("success.html")


@app.route("/sendcode", methods=["GET", "POST"])
def getdata():
    if request.method == "POST":
        # getting input with name = fname in HTML form
        code = request.form.get("code")
        # getting input with name = lname in HTML form
        print(code)
    return render_template("index.html")


# Run the application
if __name__ == "__main__":
    app.debug = True
    with app.app_context():
        db.create_all()
    app.run(port=5000)
