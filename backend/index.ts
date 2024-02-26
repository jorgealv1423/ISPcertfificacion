import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

type TFurniture = {
    id:number;
    name:string;
    category:string;
}

let furnitures: TFurniture[] = [
    {
        id:1,
        name:"Mesa",
        category:"Sala"
    }
]

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // app.use((req, res, next) => {
    //     if (ic.caller().isAnonymous()) {
    //         res.status(401);
    //         res.send();
    //     } else {
    //         next();
    //     }
    // });

    app.post('/create',(req, res)=>{
        const furniture = furnitures.find((furniture)=>furniture.id === parseInt(req.body.id));
        if(furniture){
            res.status(400).json({msg:"El id ya esta en uso.", data:furniture});
            return;
        }
        req.body.id = furnitures[furnitures.length - 1].id + 1;
        furnitures.push(req.body);
        res.status(200).json({msg:"Mueble añadido exitosamente"});
    });

    app.get('/get',(req,res)=>{
        res.status(200).json({msg:"Muebles obtenidos con exito", data:furnitures});
    });

    app.put('/update/:id', (req, res)=>{
        const furniture = furnitures.find((furniture)=>furniture.id === parseInt(req.params.id));

        if(!furniture){
            res.status(404).json({msg:"El mueble a actualizar no existe."});
            return;
        }

        const UFurniture = {...furniture, ...req.body};

        furnitures = furnitures.map((e) => e.id === UFurniture.id ? UFurniture : e);

        res.status(200).json({msg:"El mueble se actualizo con exito"});
    });

    app.delete('/delete/:id',(req, res)=>{
        furnitures = furnitures.filter((e) => e.id !== parseInt(req.params.id));
        res.status(200).json({msg:"El mueble se elimino con exito", data:furnitures});
    });



    app.post('/test', (req, res) => {
        res.json(req.body);
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    return app.listen();
});