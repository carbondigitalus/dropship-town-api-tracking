// Core Modules
import { Readable } from 'stream';

// NPM Modules
const axios = require('axios').default;
const csv = require('csvtojson');
const dotenv = require('dotenv');
const tsDBConnect = require('typeorm');
require('reflect-metadata');

// local file imports
import { DropshipTownCSV } from './db/entity';

// Enable Config File
dotenv.config({
    path: './config.env'
});

let DropshipTownRepo: any;

const saveData = (json: any) => {
    return new Promise((resolve, reject) => {
        const bangla = DropshipTownRepo.create({
            sku: json['sku'],
            creation_date: json['creation_date'],
            qty: json['qty'],
            price: json['price'],
            map_price: json['map_price'],
            shipping_cost: json['shipping_cost'],
            name: json['name'],
            package_includes: json['package_includes'],
            description: json['description'],
            condition_description: json['condition_description'],
            condition: json['condition'],
            category_name: json['category_name'],
            image_1_url: json['image_1_url'],
            image_2_url: json['image_2_url'],
            image_3_url: json['image_3_url'],
            image_4_url: json['image_4_url'],
            image_5_url: json['image_5_url'],
            manufacturer: json['manufacturer'],
            model_number: json['model_number'],
            mpn: json['mpn'],
            upc_code: json['upc_code'],
            package_height: json['package_height'],
            package_length: json['package_length'],
            package_width: json['package_width'],
            weight: json['weight'],
            returnable: json['returnable'],
            warranty: json['warranty'],
            warehouse_code: json['warehouse_code'],
            warehouse_location: json['warehouse_location'],
            hot_item: json['hot_item'],
            new_arrival: json['new_arrival']
        });

        try {
            resolve(DropshipTownRepo.save(bangla));
        } catch (error) {
            reject(error);
        }
    });
};

const connectDatabase = async () => {
    try {
        // Connect to MySQL DB
        // const connection =
        const connection = await tsDBConnect.createConnection({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            logging: true,
            entities: [DropshipTownCSV],
            synchronize: true
        });

        DropshipTownRepo = connection.getRepository(DropshipTownCSV);

        // here you can start to work with your entities
        console.log('MySQL Database Connection Status: success');

        const { data } = await axios.get(
            'https://www.dropshiptown.com/api/products.csv'
        );

        console.log(
            'Successfully read data from https://www.dropshiptown.com/api/products.csv'
        );

        csv()
            .fromStream(Readable.from(data))
            .subscribe(
                (json: any) => saveData(json),
                (err: Error) => console.error(err.message)
            );
    } catch (error) {
        console.log('Error in Reading File ' + error);
    }
};

connectDatabase();


// When applicable your responses will include:
// dropship_town_order_id - Your Dropship Town Order #
// customer_po_number - Your PO#
// lookup_id - The order ID you used for your search
// current_order_status - The current status of your order
// shipped - Will let you know if order has shipped by Yes/No response
// shipping_method_selected - Will give you shipping method you selected for order
// ship_time - Will give you date/time when order shipped
// shipments - Will be an array of carrier and tracking number for all shipments in order
// response_code - Response Code
// response_desc - Response Description.