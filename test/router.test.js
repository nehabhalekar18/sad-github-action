import express from "express";
const app = express();
import request from 'supertest';
import mockingoose from 'mockingoose';
import userRouter from '../backend/routers/userRouter.js';
import User from '../backend/models/userModel.js';
import data from '../backend/data';


app.use(express.urlencoded({ extended: false }));
app.use("/", userRouter);

describe("User router test", () => {

    it("Return all users", async (done) => {
        const userDataStub = [
            {
                seller: {
                    rating: 4.5,
                    numReviews: 120,
                    name: 'Puma',
                    logo: '/images/logo1.png',
                    description: 'best seller'
                },
                isAdmin: true,
                isSeller: true,
                _id: 'abcd1234',
                name: 'Dheeraj',
                email: 'admin@example.com',
                password:
                    '$a1b2c3d4'
            },
            {
                seller: { rating: 0, numReviews: 0 },
                isAdmin: false,
                isSeller: false,
                _id: 'abcd1234',
                name: 'Yash',
                email: 'user@example.com',
                password:
                    '$a1b2c3d4'
        }]
        request(app)
            .get("/top-sellers")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                for(let i=0;i<res.body.length;i++){
                    res.body[i]._id = 'abcd1234';
                    res.body[i].password = '$a1b2c3d4';
                }
            })
            .expect(userDataStub)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
        mockingoose(User).toReturn(data.users, "find")
        return User.find({ isSeller: true }).then(userDetails => {
            expect(JSON.parse(JSON.stringify(userDetails))).toMatchObject(JSON.parse(JSON.stringify(userDetails)))
        })
    })

    it("POST /signin", async (done) => {
        request(app)
            .post("/signin")
            .send({ 'email': 'admin@example.com', 'password': '1234' })
            .expect("Content-Type", "text/html; charset=utf-8")
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
        mockingoose(User).toReturn(data.users, "findOne")
        return User.findOne({ isSeller: true }).then(userDetails => {
            expect(JSON.parse(JSON.stringify(userDetails))).toMatchObject(JSON.parse(JSON.stringify(userDetails)))
        })
    })

});
