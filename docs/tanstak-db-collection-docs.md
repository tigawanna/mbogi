Tanstack db usage

Th oethr dpcs #fetch: https://tanstack.com/db/latest/docs/quick-start
## `Collection.insert`
Inserts one or more items into the collection

@param items — Single item or array of items to insert

@param config — Optional configuration including metadata

@returns — A Transaction object representing the insert operation(s)

@throws — {SchemaValidationError} If the data fails schema validation

@example
```ts
// Insert a single todo (requires onInsert handler)
const tx = collection.insert({ id: "1", text: "Buy milk", completed: false })
await tx.isPersisted.promise
@example

// Insert multiple todos at once
const tx = collection.insert([
  { id: "1", text: "Buy milk", completed: false },
  { id: "2", text: "Walk dog", completed: true }
])
await tx.isPersisted.promise
@example

// Insert with metadata
const tx = collection.insert({ id: "1", text: "Buy groceries" },
  { metadata: { source: "mobile-app" } }
)
await tx.isPersisted.promise
@example

// Handle errors
try {
  const tx = collection.insert({ id: "1", text: "New item" })
  await tx.isPersisted.promise
  console.log('Insert successful')
} catch (error) {
  console.log('Insert failed:', error)
}
```


## `Collection.update`
Updates one or more items in the collection using a callback function

@param keys — Single key or array of keys to update

@param configOrCallback — Either update configuration or update callback

@param maybeCallback — Update callback if config was provided

@returns — A Transaction object representing the update operation(s)

@throws — {SchemaValidationError} If the updated data fails schema validation

@example
```ts
// Update single item by key
const tx = collection.update("todo-1", (draft) => {
  draft.completed = true
})
await tx.isPersisted.promise
@example

// Update multiple items
const tx = collection.update(["todo-1", "todo-2"], (drafts) => {
  drafts.forEach(draft => { draft.completed = true })
})
await tx.isPersisted.promise
@example

// Update with metadata
const tx = collection.update("todo-1",
  { metadata: { reason: "user update" } },
  (draft) => { draft.text = "Updated text" }
)
await tx.isPersisted.promise
@example

// Handle errors
try {
  const tx = collection.update("item-1", draft => { draft.value = "new" })
  await tx.isPersisted.promise
  console.log('Update successful')
} catch (error) {
  console.log('Update failed:', error)
}
```

## `Collection.delete`

Deletes one or more items from the collection

@param keys — Single key or array of keys to delete

@param config — Optional configuration including metadata

@returns — A Transaction object representing the delete operation(s)

@example

```ts
// Delete a single item
const tx = collection.delete("todo-1")
await tx.isPersisted.promise
@example

// Delete multiple items
const tx = collection.delete(["todo-1", "todo-2"])
await tx.isPersisted.promise
@example

// Delete with metadata
const tx = collection.delete("todo-1", { metadata: { reason: "completed" } })
await tx.isPersisted.promise
@example

// Handle errors
try {
  const tx = collection.delete("item-1")
  await tx.isPersisted.promise
  console.log('Delete successful')
} catch (error) {
  console.log('Delete failed:', error)
}
```
