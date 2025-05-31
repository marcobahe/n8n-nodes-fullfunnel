"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullFunnel = void 0;
class FullFunnel {
    constructor() {
        this.description = {
            displayName: 'FullFunnel',
            name: 'fullFunnel',
            icon: 'file:fullfunnel.svg',
            group: ['transform'],
            version: 1,
            description: 'Integração com a API da FullFunnel',
            defaults: {
                name: 'FullFunnel',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'fullFunnelApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Recurso',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Lead',
                            value: 'lead',
                        },
                    ],
                    default: 'lead',
                },
                {
                    displayName: 'Operação',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['lead'],
                        },
                    },
                    options: [
                        {
                            name: 'Criar',
                            value: 'create',
                            description: 'Criar um novo lead',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Nome',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['lead'],
                            operation: ['create'],
                        },
                    },
                    description: 'Nome do lead',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['lead'],
                            operation: ['create'],
                        },
                    },
                    description: 'Email do lead',
                },
                {
                    displayName: 'Telefone',
                    name: 'phone',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['lead'],
                            operation: ['create'],
                        },
                    },
                    description: 'Telefone do lead',
                },
                {
                    displayName: 'Location ID',
                    name: 'locationId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['lead'],
                            operation: ['create'],
                        },
                    },
                    description: 'ID da localização no FullFunnel',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                if (resource === 'lead' && operation === 'create') {
                    const name = this.getNodeParameter('name', i);
                    const email = this.getNodeParameter('email', i);
                    const phone = this.getNodeParameter('phone', i);
                    const locationId = this.getNodeParameter('locationId', i);
                    const credentials = await this.getCredentials('fullFunnelApi');
                    const baseUrl = 'https://rest.gohighlevel.com/v1';
                    const options = {
                        method: 'POST',
                        uri: `${baseUrl}/contacts/`,
                        headers: {
                            'Authorization': `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                            'Version': '2021-07-28',
                        },
                        body: {
                            firstName: name,
                            email: email,
                            phone: phone,
                            locationId: locationId,
                        },
                        json: true,
                    };
                    const response = await this.helpers.request(options);
                    returnData.push({
                        json: response,
                        pairedItem: { item: i },
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.FullFunnel = FullFunnel;
//# sourceMappingURL=FullFunnel.node.js.map