#  CyberSweep API Server: TypeScript + NodeJS + Express
 
---

## Project Installation

&ensp;

1. Clone the project repository.
    ```sh
    $ git clone <repository_link_here>
    $ cd cybersweep-server-ts
    ```

&ensp;

2. Duplicate `.env.bak` and rename it to `.env.<stage>.<host>` .
    ```sh
    $ cp .env.bak .env.development.local
    ```

&ensp;

3. Create your mongodb database as defined in your `.env.<stage>.<host>`.
    ```sh
    # Inside Mongosh
    > use <DB_NAME>
    > db.createUser({
        user: "<DB_UN>",
        pwd: "<DB_PW>",
        roles: [
            {
                role: "readWrite",
                db: "<DB_NAME>"
            }]
    })
    ```




&ensp;

4. Install the project dependencies.
    ```sh
    $ npm install
    ```

&ensp;

5. Run the server
    ```sh
    $ npm run dev

    # Use http://localhost:3000/v1/ to access the API.
    # Navigate to http://localhost:3000/docs for API documenation, built with Swagger.
    ```
&ensp;

- Run unit test
    ```sh
    $ npm run test
    ```
