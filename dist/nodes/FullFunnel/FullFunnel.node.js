"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullFunnel = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class FullFunnel {
    constructor() {
        this.description = {
            displayName: 'FullFunnel Contacts',
            name: 'fullFunnelContacts',
            icon: 'file:fullfunnel.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Gerenciar contatos na FullFunnel (GoHighLevel)',
            defaults: {
                name: 'FullFunnel Contacts',
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
                        {
                            name: 'Upsert',
                            value: 'upsert',
                            description: 'Create or update a contact',
                            action: 'Upsert a contact',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    displayOptions: {
                        show: {
                            resource: ['contact'],
                            operation: ['create', 'upsert'],
                        },
                    },
                    default: '',
                    description: 'Email address of the contact',
                },
                {
                    displayName: 'Phone',
                    name: 'phone',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['contact'],
                            operation: ['create', 'upsert'],
                        },
                    },
                    default: '',
                    description: 'Phone number of the contact (required for upsert)',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['contact'],
                            operation: ['create', 'upsert'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'Full name of the contact',
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
                            displayName: 'Address',
                            name: 'address1',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'City',
                            name: 'city',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'State',
                            name: 'state',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Country',
                            name: 'country',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Postal Code',
                            name: 'postalCode',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Tags',
                            name: 'tags',
                            type: 'string',
                            default: '',
                            description: 'Comma-separated list of tags',
                        },
                        {
                            displayName: 'Source',
                            name: 'source',
                            type: 'string',
                            default: '',
                            description: 'Source of the contact',
                        },
                        {
                            displayName: 'Custom Fields',
                            name: 'customFields',
                            type: 'json',
                            default: '{}',
                            description: 'Custom fields as JSON object',
                        },
                    ],
                },
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
                    description: 'The ID of the contact',
                },
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
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'Full name of the contact',
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
                        {
                            displayName: 'Address',
                            name: 'address1',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'City',
                            name: 'city',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'State',
                            name: 'state',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Country',
                            name: 'country',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Postal Code',
                            name: 'postalCode',
                            type: 'string',
                            default: '',
                        },
                        {
                            displayName: 'Tags',
                            name: 'tags',
                            type: 'string',
                            default: '',
                            description: 'Comma-separated list of tags',
                        },
                        {
                            displayName: 'Custom Fields',
                            name: 'customFields',
                            type: 'json',
                            default: '{}',
                            description: 'Custom fields as JSON object',
                        },
                    ],
                },
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
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['contact'],
                            operation: ['getAll'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Query',
                            name: 'query',
                            type: 'string',
                            default: '',
                            description: 'Search query to filter contacts',
                        },
                        {
                            displayName: 'Tags',
                            name: 'tags',
                            type: 'string',
                            default: '',
                            description: 'Comma-separated list of tags to filter by',
                        },
                        {
                            displayName: 'Start After',
                            name: 'startAfter',
                            type: 'string',
                            default: '',
                            description: 'Contact ID to start after (for pagination)',
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('fullFunnelApi');
        const locationId = credentials.locationId;
        const baseURL = 'https://rest.gohighlevel.com/v2';
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'contact') {
                    let response;
                    if (operation === 'create') {
                        const email = this.getNodeParameter('email', i);
                        const phone = this.getNodeParameter('phone', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            email,
                            phone,
                            locationId,
                        };
                        if (additionalFields.name)
                            body.name = additionalFields.name;
                        if (additionalFields.firstName)
                            body.firstName = additionalFields.firstName;
                        if (additionalFields.lastName)
                            body.lastName = additionalFields.lastName;
                        if (additionalFields.address1)
                            body.address1 = additionalFields.address1;
                        if (additionalFields.city)
                            body.city = additionalFields.city;
                        if (additionalFields.state)
                            body.state = additionalFields.state;
                        if (additionalFields.country)
                            body.country = additionalFields.country;
                        if (additionalFields.postalCode)
                            body.postalCode = additionalFields.postalCode;
                        if (additionalFields.source)
                            body.source = additionalFields.source;
                        if (additionalFields.tags) {
                            body.tags = additionalFields.tags.toString().split(',').map(tag => tag.trim());
                        }
                        if (additionalFields.customFields) {
                            try {
                                const customFields = typeof additionalFields.customFields === 'string'
                                    ? JSON.parse(additionalFields.customFields)
                                    : additionalFields.customFields;
                                body.customFields = customFields;
                            }
                            catch (e) {
                                throw new Error('Invalid JSON in custom fields');
                            }
                        }
                        const options = {
                            method: 'POST',
                            url: `${baseURL}/contacts`,
                            body,
                            json: true,
                        };
                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.contact || response });
                    }
                    if (operation === 'get') {
                        const contactId = this.getNodeParameter('contactId', i);
                        const options = {
                            method: 'GET',
                            url: `${baseURL}/contacts/${contactId}`,
                            json: true,
                        };
                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.contact || response });
                    }
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = this.getNodeParameter('limit', i, 50);
                        const filters = this.getNodeParameter('filters', i);
                        const qs = {
                            locationId,
                            limit: returnAll ? 100 : limit,
                        };
                        if (filters.query)
                            qs.query = filters.query;
                        if (filters.tags)
                            qs.tags = filters.tags;
                        if (filters.startAfter)
                            qs.startAfter = filters.startAfter;
                        const options = {
                            method: 'GET',
                            url: `${baseURL}/contacts`,
                            qs,
                            json: true,
                        };
                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        const contacts = response.contacts || [];
                        if (returnAll && contacts.length === 100) {
                            let allContacts = [...contacts];
                            let startAfter = contacts[contacts.length - 1]?.id;
                            while (startAfter && allContacts.length < 500) {
                                qs.startAfter = startAfter;
                                const nextResponse = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', {
                                    ...options,
                                    qs,
                                });
                                const nextContacts = nextResponse.contacts || [];
                                if (nextContacts.length === 0)
                                    break;
                                allContacts.push(...nextContacts);
                                startAfter = nextContacts[nextContacts.length - 1]?.id;
                            }
                            returnData.push(...allContacts.map((contact) => ({ json: contact })));
                        }
                        else {
                            returnData.push(...contacts.slice(0, limit).map((contact) => ({ json: contact })));
                        }
                    }
                    if (operation === 'update') {
                        const contactId = this.getNodeParameter('contactId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {};
                        if (updateFields.email)
                            body.email = updateFields.email;
                        if (updateFields.phone)
                            body.phone = updateFields.phone;
                        if (updateFields.name)
                            body.name = updateFields.name;
                        if (updateFields.firstName)
                            body.firstName = updateFields.firstName;
                        if (updateFields.lastName)
                            body.lastName = updateFields.lastName;
                        if (updateFields.address1)
                            body.address1 = updateFields.address1;
                        if (updateFields.city)
                            body.city = updateFields.city;
                        if (updateFields.state)
                            body.state = updateFields.state;
                        if (updateFields.country)
                            body.country = updateFields.country;
                        if (updateFields.postalCode)
                            body.postalCode = updateFields.postalCode;
                        if (updateFields.tags) {
                            body.tags = updateFields.tags.toString().split(',').map(tag => tag.trim());
                        }
                        if (updateFields.customFields) {
                            try {
                                const customFields = typeof updateFields.customFields === 'string'
                                    ? JSON.parse(updateFields.customFields)
                                    : updateFields.customFields;
                                body.customFields = customFields;
                            }
                            catch (e) {
                                throw new Error('Invalid JSON in custom fields');
                            }
                        }
                        const options = {
                            method: 'PUT',
                            url: `${baseURL}/contacts/${contactId}`,
                            body,
                            json: true,
                        };
                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.contact || response });
                    }
                    if (operation === 'delete') {
                        const contactId = this.getNodeParameter('contactId', i);
                        const options = {
                            method: 'DELETE',
                            url: `${baseURL}/contacts/${contactId}`,
                            json: true,
                        };
                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: { success: true, contactId } });
                    }
                    if (operation === 'upsert') {
                        const email = this.getNodeParameter('email', i);
                        const phone = this.getNodeParameter('phone', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (!email && !phone) {
                            throw new Error('Either email or phone is required for upsert operation');
                        }
                        const body = {
                            locationId,
                        };
                        if (email)
                            body.email = email;
                        if (phone)
                            body.phone = phone;
                        if (additionalFields.name)
                            body.name = additionalFields.name;
                        if (additionalFields.firstName)
                            body.firstName = additionalFields.firstName;
                        if (additionalFields.lastName)
                            body.lastName = additionalFields.lastName;
                        if (additionalFields.address1)
                            body.address1 = additionalFields.address1;
                        if (additionalFields.city)
                            body.city = additionalFields.city;
                        if (additionalFields.state)
                            body.state = additionalFields.state;
                        if (additionalFields.country)
                            body.country = additionalFields.country;
                        if (additionalFields.postalCode)
                            body.postalCode = additionalFields.postalCode;
                        if (additionalFields.source)
                            body.source = additionalFields.source;
                        if (additionalFields.tags) {
                            body.tags = additionalFields.tags.toString().split(',').map(tag => tag.trim());
                        }
                        if (additionalFields.customFields) {
                            try {
                                const customFields = typeof additionalFields.customFields === 'string'
                                    ? JSON.parse(additionalFields.customFields)
                                    : additionalFields.customFields;
                                body.customFields = customFields;
                            }
                            catch (e) {
                                throw new Error('Invalid JSON in custom fields');
                            }
                        }
                        const options = {
                            method: 'POST',
                            url: `${baseURL}/contacts/upsert`,
                            body,
                            json: true,
                        };
                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.contact || response });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            details: error.response?.body || error.response?.data || 'No additional details'
                        }
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
            }
        }
        return [returnData];
    }
}
exports.FullFunnel = FullFunnel;
//# sourceMappingURL=FullFunnel.node.js.map