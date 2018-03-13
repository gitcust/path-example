import {AbstractDatabase} from "../database/abstract-database";

export abstract class AbstractRestService {

    constructor(protected _app, protected _database: AbstractDatabase) {
    }

    public init() {
        this.initList();
        this.initCreate();
        this.initRead();
        this.initUpdate();
        this.initDelete();
    }

    protected initList() {
        let service = this;
        this._app.get('/services/' + service._database.getEntityName() + '', async (req, res) => {
            let rows = await service._database.list();
            if (req.query.search) {
                rows = this.filter(rows, req.query.search, service._database.getSearchAttributes());
            }
            this._database.createPathList(rows, res);
        });
    }

    protected filter(list, searchText: string, searchAttributes: string[]) {
        searchText = searchText.toLowerCase();
        let matches = [], i, key;
        for (let element of list) {
            for (let key of searchAttributes) {
                if (element[key]) {
                    let value = element[key].toLowerCase();
                    if (value.indexOf(searchText) > -1) {
                        matches.push(element);
                    }
                }
            }
        }
        return matches;
    }

    protected initCreate() {
        this._app.post('/services/' + this._database.getEntityName() + '', async (req, res) => {
            let newDoc = await this._database.create(req.body);
            res.json(newDoc);
        });
    }

    protected initRead() {
        this._app.get('/services/' + this._database.getEntityName() + '/:key', async (req, res) => {
            let key: string = req.params.key;
            let doc = await this._database.read(key);
            res.json(doc);
        });
    }

    protected initUpdate() {
        this._app.put('/services/' + this._database.getEntityName() + '/:key', async (req, res) => {
            let key: string = req.params.key;
            let doc = await this._database.update(key, req.body);
            res.json(doc);
        });
    }

    protected initDelete() {
        this._app.delete('/services/' + this._database.getEntityName() + '/:key', async (req, res) => {
            let key: string = req.params.key;
            let doc = await this._database.delete(key);
            res.json({message: 'deleted'});
        });
    }
}