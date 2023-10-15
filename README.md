# refine-sqlite

[![npm version](https://badge.fury.io/js/refine-sqlite.svg)](https://badge.fury.io/js/refine-sqlite)
[![npm](https://img.shields.io/npm/dt/refine-sqlite.svg)](https://www.npmjs.com/package/refine-sqlite)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

Start the development of your next refine app with a lightweight local database!

This integration with the [refine](https://refine.dev/) framework makes the lightweight [SQLite](https://www.sqlite.org/index.html) database available for usage within your app. 

## Features

- **Easy to use** - Just import the data provider and use it in your app.
- **Lightweight** - The SQLite database is lightweight and can be used in your app locally.
- **Fast** - Start developing your app without the need to setup a full database server or API.
- **Simple** - You won't need to type SQL queries, just use the data provider methods. Except for the tables creation, which you can easily do with the [DB Browser for SQLite](https://sqlitebrowser.org/).

### Available methods

<table>
<th>Method</th>
<th>Description</th>
<tr>
<td><code>create()</code></td>
<td>Create a new record</td>
</tr>
<tr>
<td><code>update()</code></td>
<td>Update an existing record</td>
</tr>
<tr>
<td><code>deleteOne()</code></td>
<td>Delete a single record</td>
</tr>
<tr>
<td><code>getOne()</code></td>
<td>Get a single record</td>
</tr>
<tr>
<td><code>getList()</code></td>
<td>Get a list of records</td>
</tr>
<tr>
<td><code>getMany()</code></td>
<td>Get a list of records by ids</td>
</tr>

</table>

> **Note**
> Not all the methods have been implemented. See all [here](https://refine.dev/docs/api-reference/core/providers/data-provider/#methods).

## Installation

```bash
npm install refine-sqlite
```

## Usage

Import the data provider in `App.tsx` (Or wherever you initialize your `<Refine />` component). 

The `"database.db"` is the path to the database file. If the file does not exist, it will be created.

```ts
import dataProvider from "refine-sqlite";

<Refine
    ...
    dataProvider={dataProvider("database.db")}
/>
```
Now you can use it in your app. Just make sure to have the table (resource) already created in the database.
```ts
const response = await dataProvider("database.db")
    .getList({
        resource: "posts",
        sorters: [
            {
                field: "id",
                order: "desc",
            }
        ],
    });

const { data } = response;
...
```

> **Warning**
> Work in progress, built using code from https://github.com/refinedev/refine/tree/master/packages/simple-rest