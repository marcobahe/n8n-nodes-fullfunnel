import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class FullFunnelApi implements ICredentialType {
    name = 'fullFunnelApi';
    displayName = 'FullFunnel API';
    documentationUrl = 'https://fullfunnel.io/api-docs';
    properties: INodeProperties[] = [
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
    
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{"Bearer " + $credentials.apiKey}}',
                Version: '={{$credentials.apiVersion}}',
            },
        },
    };
    
    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://rest.gohighlevel.com/v2',
            url: '/locations/{{$credentials.locationId}}',
            method: 'GET',
        },
    };
}
