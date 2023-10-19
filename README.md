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

<p align="center">A Data Provider for <a href="https://refine.dev">refine</a> using <a href="https://www.sqlite.org/index.html">SQLite.</a></p>

<div align="center">

[![npm version](https://badge.fury.io/js/refine-sqlite.svg)](https://www.npmjs.com/package/refine-sqlite)
[![npm](https://img.shields.io/npm/dt/refine-sqlite.svg)](https://www.npmjs.com/package/refine-sqlite)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mateusabelli/refine-sqlite/blob/main/LICENSE.md)

</div>

<br>

## Getting Started

With **refine-sqlite** you can quickly start developing your next [refine](https://refine.dev/app) project with a lightweight local database.

Start creating your app as fast as possible without the need to set up a complex database server or API.

## Features

- **Easy to use** - Just import the data provider and use it in your app.
- **Lightweight** - The SQLite database is lightweight and can be used in your app locally.
- **Fast** - Start developing your app without the need to set up a full database server or API.
- **Simple** - You won't need to type SQL queries, just use the data provider methods. Except for the tables creation, which you can easily do with the [DB Browser for SQLite](https://sqlitebrowser.org/).

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

## Contributing

All contributions are welcome and appreciated! Please create an [Issue](https://github.com/mateusabelli/refine-sqlite/issues) or [Pull Request](https://github.com/mateusabelli/refine-sqlite/pulls) if you encounter any problems or have suggestions for improvements.

If you want to say **thank you** or/and support active development of **refine-sqlite**

-  Add a [GitHub Star](https://github.com/mateusabelli/refine-sqlite) to the project.
- Tweet about the project [on Twitter / X](https://twitter.com/intent/tweet?text=With%20refine-sqlite%20you%20can%20quickly%20start%20developing%20your%20next%20refine%20project%20with%20a%20lightweight%20local%20database.%20Check%20it%20out!%0A%0A%20https%3A//github.com/mateusabelli/refine-sqlite%20).
- Write interesting articles about the project on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or personal blog.

## License

**refine-sqlite** is free and open-source software licensed under the [MIT](./LICENSE.md) License.<br>The feather icon is from [Phosphor Icons](https://phosphoricons.com/) licensed under the MIT License.
