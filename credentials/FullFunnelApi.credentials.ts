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

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{"Bearer " + $credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://services.leadconnectorhq.com',
            url: '/locations/{{$credentials.locationId}}',
        },
    };
}
