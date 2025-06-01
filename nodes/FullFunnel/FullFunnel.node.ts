import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    NodeOperationError,
    NodeConnectionType,
        } from 'n8n-workflow';

export class FullFunnel implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'FullFunnel Contacts',
        name: 'fullFunnelContacts',
        icon: 'file:fullfunnel.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Gerenciar contatos na FullFunnel (HighLevel)',
        defaults: {
            name: 'FullFunnel Contacts',
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
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Contact',
                        value: 'contact',
                    },
                ],
                default: 'contact',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new contact',
                        action: 'Create a contact',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a contact',
                        action: 'Delete a contact',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a contact by ID',
                        action: 'Get a contact',
                    },
                    {
                        name: 'Get All',
                        value: 'getAll',
                        description: 'Get all contacts',
                        action: 'Get all contacts',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a contact',
                        action: 'Update a contact',
                    },
                ],
                default: 'create',
            },
            // Create Contact Fields
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                default: '',
            },
            {
                displayName: 'First Name',
                name: 'firstName',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                default: '',
            },
            {
                displayName: 'Last Name',
                name: 'lastName',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                default: '',
            },
            {
                displayName: 'Phone',
                name: 'phone',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['create'],
                    },
                },
                default: '',
            },
            // Get/Delete Contact Fields
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['get', 'delete', 'update'],
                    },
                },
                default: '',
            },
            // Update Contact Fields
            {
                displayName: 'Update Fields',
                name: 'updateFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['update'],
                    },
                },
                options: [
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        placeholder: 'name@email.com',
                        default: '',
                    },
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Phone',
                        name: 'phone',
                        type: 'string',
                        default: '',
                    },
                ],
            },
            // Get All Contacts Fields
            {
                displayName: 'Return All',
                name: 'returnAll',
                type: 'boolean',
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['getAll'],
                    },
                },
                default: false,
                description: 'Whether to return all results or only up to a given limit',
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['contact'],
                        operation: ['getAll'],
                        returnAll: [false],
                    },
                },
                typeOptions: {
                    minValue: 1,
                    maxValue: 100,
                },
                default: 50,
                description: 'Max number of results to return',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);

        const credentials = await this.getCredentials('fullFunnelApi');
        const apiKey = credentials.apiKey as string;
        const locationId = credentials.locationId as string;

        const baseURL = 'https://services.leadconnectorhq.com';

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'contact') {
                    if (operation === 'create') {
                        const email = this.getNodeParameter('email', i) as string;
                        const firstName = this.getNodeParameter('firstName', i) as string;
                        const lastName = this.getNodeParameter('lastName', i) as string;
                        const phone = this.getNodeParameter('phone', i) as string;

                        const body = {
                            email,
                            firstName,
                            lastName,
                            phone,
                            locationId,
                        };

                        const response = await this.helpers.request({
                            method: 'POST',
                            url: `${baseURL}/contacts/`,
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Version': '2021-07-28',
                            },
                            body,
                            json: true,
                        });

                        returnData.push({ json: response });
                    }

                    if (operation === 'get') {
                        const contactId = this.getNodeParameter('contactId', i) as string;

                        const response = await this.helpers.request({
                            method: 'GET',
                            url: `${baseURL}/contacts/${contactId}`,
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Version': '2021-07-28',
                            },
                            json: true,
                        });

                        returnData.push({ json: response.contact });
                    }

                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = this.getNodeParameter('limit', i, 50) as number;

                        const qs: IDataObject = {
                            locationId,
                            limit: returnAll ? 100 : limit,
                        };

                        const response = await this.helpers.request({
                            method: 'GET',
                            url: `${baseURL}/contacts/`,
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Version': '2021-07-28',
                            },
                            qs,
                            json: true,
                        });

                        if (returnAll) {
                            returnData.push(...response.contacts.map((contact: IDataObject) => ({ json: contact })));
                        } else {
                            returnData.push(...response.contacts.slice(0, limit).map((contact: IDataObject) => ({ json: contact })));
                        }
                    }

                    if (operation === 'update') {
                        const contactId = this.getNodeParameter('contactId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i);

                        const body = {
                            ...updateFields,
                        };

                        const response = await this.helpers.request({
                            method: 'PUT',
                            url: `${baseURL}/contacts/${contactId}`,
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Version': '2021-07-28',
                            },
                            body,
                            json: true,
                        });

                        returnData.push({ json: response.contact });
                    }

                    if (operation === 'delete') {
                        const contactId = this.getNodeParameter('contactId', i) as string;

                        await this.helpers.request({
                            method: 'DELETE',
                            url: `${baseURL}/contacts/${contactId}`,
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Version': '2021-07-28',
                            },
                            json: true,
                        });

                        returnData.push({ json: { success: true } });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error);
            }
        }

        return [returnData];
    }
}
