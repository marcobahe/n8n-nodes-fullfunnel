import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    NodeConnectionType,
    IHttpRequestMethods
} from 'n8n-workflow';
export class FullFunnel implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'FullFunnel',
        name: 'fullFunnel',
        icon: 'file:fullfunnel.svg',
        group: ['transform'],
        version: 1,
        description: 'Integração com a API da FullFunnel',
        defaults: {
            name: 'FullFunnel',
        },
       inputs: [NodeConnectionType.Main],
outputs: [NodeConnectionType.Main],
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

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;

                if (resource === 'lead' && operation === 'create') {
                    const name = this.getNodeParameter('name', i) as string;
                    const email = this.getNodeParameter('email', i) as string;
                    const phone = this.getNodeParameter('phone', i) as string;
                    const locationId = this.getNodeParameter('locationId', i) as string;

                    const credentials = await this.getCredentials('fullFunnelApi');
                    
                    const baseUrl = 'https://rest.gohighlevel.com/v1';
                    const options = {
                        method: 'POST' as IHttpRequestMethods,
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
            } catch (error) {
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
