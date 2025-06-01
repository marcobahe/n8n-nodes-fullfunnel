"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullFunnelApi = void 0;
class FullFunnelApi {
    constructor() {
        this.name = 'fullFunnelApi';
        this.displayName = 'FullFunnel API';
        this.documentationUrl = 'https://fullfunnel.io/api-docs';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The API key for FullFunnel API',
            },
            {
                displayName: 'Location ID',
                name: 'locationId',
                type: 'string',
                default: '',
                required: true,
                description: 'The Location ID for FullFunnel API',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '={{"Bearer " + $credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://services.leadconnectorhq.com',
                url: '/locations/{{$credentials.locationId}}',
            },
        };
    }
}
exports.FullFunnelApi = FullFunnelApi;
//# sourceMappingURL=FullFunnelApi.credentials.js.map