// ****** Drop Collection ******
db.collection.drop()
// Drop Database
db.dropDatabase()

// ****** Insert ******
db.people.insert({ "name": "Joeel", "age": 25 })
db.people.insertOne({ "name": "Peter" })
db.people.insertMany([{ "name": "Peter" }, { "name": "Steve" }, { "name": "George" }])

// ****** Remove ******
db.people2.remove({})

// ****** Find ******
db.people.find()
db.people.find({})
db.people.findOne()
// Find with conditions
db.people.findOne({ "name": "joe" }, { _id: 0 })

db.people.find({"age" : {"$gte" : 18, "$lte" : 30}})
db.people.find({ "registered": { "$lt": start } })
// $ne
db.people.find({"name" : {"$ne" : "joe"}})
// $in
db.people.find({ "name": { "$in": ["Joe", "Peter", "Ivan"] } })
// $nin
db.people.find({ "name": { "$nin": ["Joe", "Peter", "Ivan"] } })
// $or
db.people.find({ "$or": [{ "name": "Peter" }, { "age": 25 }] })
// $and
db.people.find({ "$and": [{ "name": "joe" }, { "age": 20 }] })
// $mod
db.users.find({ "id_num": { "$mod": [5, 1] } })
// $eist
db.people.find({"age": { "$exists": true } })
db.people.find({"age": null })
// $all
db.food.find({ fruit: { $all: ["apple", "banana"] } })
// $size
db.food.find({"fruit" : {"$size" : 3}})
// $inc

// Embedded documents
db.user.find({ "name": { "first": "Joe", "last": "Schmoe" } })
db.user.find({ "name.first": "Joe", "name.last": "Schmoe" })

db.blog.find({ "comments": { "$elemMatch": { "author": "joe", "score": { "$gte": 5 } } } })

// ****** Update ******
db.people.replaceOne({ "name" : "Peter"},
  { "name": "Peter", "age": 23, "friends": 32, "enemies": 2 })
// update schema
var peter = db.people.findOne({ "name": "Peter" });
peter.relationships = { "friends": peter.friends, "enemies": peter.enemies };
db.people.replaceOne({ "name": "Peter" }, peter);
// $inc
db.people.update({ "name": "Peter" }, { "$inc": { "age": 1 } });
// $set
db.people.update({ "name": "George" }, { "$set": { "book": "War and Peace" } });
// $unset
db.array.update({ "froot": "apple" }, { "$unset": { "price": 1} });
// $push
db.array.update({ "froot": "apple" }, { "$push": { "prices": 12}})
// #each
db.array.update({ "froot": "apple" }, { "$push": { "prices": { "$each": [1, 2, 3, 4]} }})
// $slice
db.array.update({ "froot": "apple" }, {
  "$push": {
    "prices": {
      "$each": [1, 2, 3, 4],
      "$slice": -5
    }
  }
})
// $sort
db.array.update({ "froot": "apple" }, {
  "$push": {
    "prices": {
      "$each": [5, 2, 3, 4],
      "$slice": -10,
      "$sort": { "prices": -1}
    }
  }
})
// $addToSet
db.array.update({ "froot": "apple" }, { "$addToSet": { "prices": 12 } })
// Aggregation
// $match
db.people.aggregate(
    [ { $match : { "name" : "George" } } ]
);
// $project
db.people.aggregate({"$project": { "name": 1 } });
db.people.aggregate({ "$project": { "userId": "$_id", "_id": 0, "name": 1 } })
// $add
db.math.aggregate({
  "$project" : {
    "totalPay" : {
      "$add": ["$salary", "$bonus", "$price"]
  }}
})
// $subtract
db.math.aggregate({
  "$project" : {
    "total" : {
      "$subtract": ["$salary", "$bonus"]
  }}
})
// Data Expressions
db.sales.insert({
  "_id" : 1,
  "item" : "abc",
  "price" : 10,
  "quantity" : 2,
  "date" : ISODate("2021-12-06T08:15:39.736Z")
})
db.sales.aggregate(
  [
    {
      $project:
        {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
          hour: { $hour: "$date" },
          minutes: { $minute: "$date" },
          seconds: { $second: "$date" },
          milliseconds: { $millisecond: "$date" },
          dayOfYear: { $dayOfYear: "$date" },
          dayOfWeek: { $dayOfWeek: "$date" },
          week: { $week: "$date" }
        }
    }
  ]
)
// String Expressions
db.people.update({ "name": "Steve" }, { "$set": { "firstName": "Steve", "lastName": "Lucas", "email": "jpeter@gmail.com" } });
db.people.aggregate(
  {
    "$project": {
      "email": {
        "$concat": [
          { "$substr": ["$firstName", 0, 1] }, ".",
          "$lastName",
          "@example.com"
        ]
      }
    }
  })
  // $sum
  db.people.aggregate([{
    "$group" : {
      "_id": { "name": "$name" },
      "totalAge": { "$sum": "$age" },
      "count": { $sum: 1 }
    }
  }])
// $avg
db.people.aggregate([{
  "$group": {
    "_id": { "name": "$name" },
    "averageAge": { "$avg": "$age" }
  }
}])
// $max/$min
db.people.aggregate([{
  "$group": {
    "_id": { "name": "$name" },
    "minAge": { "$min": "$age" },
    "maxAge": { "$max": "$age" }
  }
}])
// $first/$last

// limit
db.people.find().limit(3)
// skip
db.people.find().skip(3)
// Count
db.people.count()