/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jzpljhqlvnpc3k0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ycahp0da",
    "name": "extras",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "lstqsbg8wmoensu",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jzpljhqlvnpc3k0")

  // remove
  collection.schema.removeField("ycahp0da")

  return dao.saveCollection(collection)
})
