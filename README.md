<h1 align="center">
    <img
        src=".github/feather.svg"
        alt=""
        width="40"
        height="40"
        align="center"
    />
    refine-sqlite
</h1>

<p align="center">Connector for backends created with <a href="https://www.sqlite.org/index.html">SQLite.</a></p>

<div align="center">

[![npm version](https://badge.fury.io/js/refine-sqlite.svg)](https://www.npmjs.com/package/refine-sqlite)
[![npm](https://img.shields.io/npm/dt/refine-sqlite.svg)](https://www.npmjs.com/package/refine-sqlite)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mateusabelli/refine-sqlite/blob/main/LICENSE.md)
[![Node.js CI](https://github.com/mateusabelli/refine-sqlite/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/mateusabelli/refine-sqlite/actions/workflows/node.js.yml)

</div>

<br>

## Getting Started

With **refine-sqlite** you can quickly start creating your app as fast as possible by leveraging the easy-to-use methods powered by [refine](https://refine.dev) to interact with your SQLite database.

## Features

- **Easy to use** - Just import the data provider and use it in your code.
- **Lightweight** - The SQLite database is lightweight and can be used locally.
- **Simple** - You won't need to type SQL queries, just use the data provider methods. Except for the tables creation, which you can easily do with the [DB Browser for SQLite](https://sqlitebrowser.org/).

## Installation

```bash
npm install refine-sqlite
```

## Usage

First, create a database file. You can use the [DB Browser for SQLite](https://sqlitebrowser.org/) to easily create the tables and insert some data, or you can also use the [sqlite3](https://www.sqlite.org/cli.html) command line shell.

Then, import the data provider to use in an async function, and pass the database file path as a parameter.

Finally, use the methods to create, update, delete, and get data from your database, filtering and sorting as you wish.

> **Note**
> `resource` is the name of the table in the database.

### Full example

```ts
import { dataProvider } from "refine-sqlite";

async function getPosts() {
  const response = await dataProvider("database.db")
    .getList({
      resource: "posts",
      filters: [
        {
          field: "category_id",
          operator: "eq",
          value: ["2"],
        },
      ],
      sorters: [
        {
          field: "title",
          order: "asc",
        },
      ],
    });
  const { data } = response;
  return data;
}
```

### Expected data from `response`

> Using the [test.db](./test.db) database file.
 
```bash
{
  data: [
    { id: 6, title: 'Dolorem unde et officiis.', category_id: 2 },
    { id: 1, title: 'Soluta et est est.', category_id: 2 }
  ],
  total: 2
}
```
 
### Available methods

| Method        | Description                           |
|---------------|---------------------------------------|
| `create()`    | Creates a new record.                 |
| `update()`    | Updates a record.                     |
| `deleteOne()` | Deletes a record.                     |
| `getOne()`    | Gets a single record.                 |
| `getList()`   | Gets a list of records.               |
| `getMany()`   | Gets a list of records by their ids.  |

> **Note**
> Not all the methods have been implemented. See all [here](https://refine.dev/docs/api-reference/core/providers/data-provider/#methods).

<details>
<summary><b>How to use the methods</b> (Click to expand)</summary>

- `create()`
    ```ts
    create({ 
      resource: "posts",
      variables: { 
        title: "New post", 
        body: "New post body"
      }
    });
    ```

- `update()`
    ```ts
    update({ 
      resource: "posts",
      id: 1,
      variables: {
        title: "Updated post" 
      } 
    });
    ```

- `deleteOne()`
    ```ts
    deleteOne({ 
      resource: "posts",
      id: 1
    });
    ```

- `getOne()`
    ```ts
    getOne({ 
      resource: "posts",
      id: 3
    });
    ```

- `getList()`
    ```ts
    getList({ resource: "posts" });
    ```

- `getMany()`
    ```ts
    getMany({ 
      resource: "posts",
      ids: [1, 2, 3]
    });
    ```
  
</details>

### Available filters

| Filter        | Description              |
|---------------|--------------------------|
| `eq`          | Is equal to              |
| `ne`          | Is not equal to          |
| `gte`         | Greater than or equal to |
| `lte`         | Less than or equal to    |
| `contains`    | Contains                 |

> **Note**
> Not all the filters have been implemented. See all [here](https://refine.dev/docs/api-reference/core/interfaceReferences/#crudfilters).

<details>
<summary><b>How to use the filters</b> (Click to expand)</summary>

- `eq`
    ```ts
    filters: [{
      field: "id", operator: "eq", value: 1
    }]
    ```
- `ne`
    ```ts
    filters: [{
      field: "id", operator: "ne", value: 1
    }]
    ```
- `gte`
    ```ts
    filters: [{
      field: "id", operator: "gte", value: 1
    }]
    ```
- `lte`
    ```ts
    filters: [{
      field: "id", operator: "lte", value: 1
    }]
    ```
- `contains`
    ```ts
    filters: [{
      field: "title", operator: "contains", value: "Lorem"
    }]
    ```
  
</details>

### Available sorters

| Order  | Description              |
|--------|--------------------------|
| `asc`  | Ascending order          |
| `desc` | Descending order         |

#### 

<details>
<summary><b>How to use the sorters</b> (Click to expand)</summary>

- `asc`
    ```ts
    sorters: [{
      field: "id", order: "asc"
    }]
    ```
- `desc`
    ```ts
    sorters: [{
      field: "id", order: "desc"
    }]
    ```
  
</details>

## Development

Clone the repository

```bash
git clone https://github.com/mateusabelli/refine-sqlite.git
```

Install the dependencies

```bash
cd refine-sqlite
pnpm install
```

Build and test

```bash
pnpm run build
pnpm run test
```

> **Important**
> Before the tests run, the database file `test.db` is deleted and recreated.

## Contributing

All contributions are welcome and appreciated! Please create an [Issue](https://github.com/mateusabelli/refine-sqlite/issues) or [Pull Request](https://github.com/mateusabelli/refine-sqlite/pulls) if you encounter any problems or have suggestions for improvements.

If you want to say **thank you** or/and support active development of **refine-sqlite**

-  Add a [GitHub Star](https://github.com/mateusabelli/refine-sqlite) to the project.
- Tweet about the project [on Twitter / X](https://twitter.com/intent/tweet?text=With%20refine-sqlite%20you%20can%20quickly%20start%20developing%20your%20next%20refine%20project%20with%20a%20lightweight%20local%20database.%20Check%20it%20out!%0A%0A%20https%3A//github.com/mateusabelli/refine-sqlite%20).
- Write interesting articles about the project on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or personal blog.
- Consider becoming a sponsor on [GitHub](https://github.com/sponsors/mateusabelli).


## Special Thanks

<table>
  <td>
    <a href="https://github.com/refinedev">
      <img src="https://github.com/refinedev.png" width=64 height=64>
      <p align="center">refine</p>
    </a>
  </td>
</table>

I'd like to thank [refine](https://github.com/refinedev), my first GitHub sponsor :heart: <br>
For believing and supporting my projects!

## License

**refine-sqlite** is free and open-source software licensed under the [MIT](./LICENSE.md) License.<br>The feather icon is from [Phosphor Icons](https://phosphoricons.com/) licensed under the MIT License.
