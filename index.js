const http = require("http");
const path = require("path");
const fs = require("fs");
const {MongoClient} = require('mongodb');

async function main(){
    const uri ="mongodb+srv://sushma:sutharapu@cluster0.lzxmbsr.mongodb.net/${courses_DB}?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
 
    try {
        await client.connect();
        return await findAllCourses(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {

                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    } else if (req.url==='/api') {
        let response = await main().catch(console.error);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(response)
    }
    else{
        res.end("<h1> 404 nothing is here</h1>");
    }
});


async function findAllCourses(client ){
    const cursor = client.db("courses_DB").collection("courses").find({});
    const results = await cursor.toArray();
    const js= (JSON.stringify(results[0]));
    return js;
};

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Great our server is running on port ${PORT} `));