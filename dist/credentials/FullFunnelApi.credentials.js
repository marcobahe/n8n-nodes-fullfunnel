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
                description: 'The Private Integration API key from your FullFunnel sub-account',
            },
            {
                displayName: 'Location ID',
                name: 'locationId',
                type: 'string',
                default: '',
                required: true,
                description: 'The Location ID (sub-account ID) for FullFunnel API',
            },
            {
                displayName: 'API Version',
                name: 'apiVersion',
                type: 'string',
                default: '2021-07-28',
                required: true,
                description: 'The API version to use (default: 2021-07-28)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '={{"Bearer " + $credentials.apiKey}}',
                    Version: '={{$credentials.apiVersion}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://rest.gohighlevel.com/v2',
                url: '/locations/{{$credentials.locationId}}',
                method: 'GET',
            },
        };
    }
}
exports.FullFunnelApi = FullFunnelApi;
//# sourceMappingURL=FullFunnelApi.credentials.js.map