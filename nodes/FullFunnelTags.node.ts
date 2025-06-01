import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    NodeOperationError,
    NodeConnectionType,
    IHttpRequestOptions,
} from 'n8n-workflow';

export class FullFunnelTags implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'FullFunnel Tags',
        name: 'fullFunnelTags',
        icon: 'file:fullfunnel.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Gerenciar tags de contatos na FullFunnel (GoHighLevel)',
        defaults: {
            name: 'FullFunnel Tags',
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
                        name: 'Contact Tags',
                        value: 'contactTags',
                    },
                ],
                default: 'contactTags',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['contactTags'],
                    },
                },
                options: [
                    {
                        name: 'Add Tags',
                        value: 'add',
                        description: 'Add tags to a contact',
                        action: 'Add tags to contact',
                    },
                    {
                        name: 'Remove Tags',
                        value: 'remove',
                        description: 'Remove tags from a contact',
                        action: 'Remove tags from contact',
                    },
                    {
                        name: 'Replace Tags',
                        value: 'replace',
                        description: 'Replace all tags of a contact',
                        action: 'Replace contact tags',
                    },
                    {
                        name: 'Bulk Add Tags',
                        value: 'bulkAdd',
                        description: 'Add tags to multiple contacts',
                        action: 'Add tags to multiple contacts',
                    },
                    {
                        name: 'Bulk Remove Tags',
                        value: 'bulkRemove',
                        description: 'Remove tags from multiple contacts',
                        action: 'Remove tags from multiple contacts',
                    },
                ],
                default: 'add',
            },
            // Single Contact Operations
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contactTags'],
                        operation: ['add', 'remove', 'replace'],
                    },
                },
                default: '',
                description: 'The ID of the contact',
            },
            {
                displayName: 'Tags',
                name: 'tags',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contactTags'],
                        operation: ['add', 'remove', 'replace'],
                    },
                },
                default: '',
                description: 'Comma-separated list of tags (e.g., "tag1, tag2, tag3")',
                placeholder: 'vip, lead-quente, cliente',
            },
            // Bulk Operations
            {
                displayName: 'Contact IDs',
                name: 'contactIds',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contactTags'],
                        operation: ['bulkAdd', 'bulkRemove'],
                    },
                },
                default: '',
                description: 'Comma-separated list of contact IDs',
                placeholder: 'id1, id2, id3',
            },
            {
                displayName: 'Tags',
                name: 'bulkTags',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['contactTags'],
                        operation: ['bulkAdd', 'bulkRemove'],
                    },
                },
                default: '',
                description: 'Comma-separated list of tags to add/remove',
                placeholder: 'newsletter, promocao',
            },
            // Optional Fields
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['contactTags'],
                    },
                },
                options: [
                    {
                        displayName: 'Case Sensitive',
                        name: 'caseSensitive',
                        type: 'boolean',
                        default: false,
                        description: 'Whether tag matching should be case sensitive',
                    },
                    {
                        displayName: 'Create Missing Tags',
                        name: 'createMissing',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to create tags that don\'t exist yet',
                    },
                    {
                        displayName: 'Normalize Tags',
                        name: 'normalize',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to normalize tags (trim spaces, lowercase)',
                    },
                ],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);

        const credentials = await this.getCredentials('fullFunnelApi');
        const locationId = credentials.locationId as string;
        const baseURL = 'https://rest.gohighlevel.com/v2';

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'contactTags') {
                    const options = this.getNodeParameter('options', i) as IDataObject;
                    let response: any;

                    // Helper function to process tags
                    const processTags = (tagsString: string): string[] => {
                        let tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
                        
                        if (options.normalize) {
                            tags = tags.map(tag => tag.toLowerCase().trim());
                        }
                        
                        // Remove duplicates
                        return [...new Set(tags)];
                    };

                    if (operation === 'add') {
                        const contactId = this.getNodeParameter('contactId', i) as string;
                        const tagsString = this.getNodeParameter('tags', i) as string;
                        const tags = processTags(tagsString);

                        const requestOptions: IHttpRequestOptions = {
                            method: 'POST',
                            url: `${baseURL}/contacts/${contactId}/tags`,
                            body: {
                                tags,
                            },
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', requestOptions);
                        returnData.push({ 
                            json: { 
                                success: true,
                                contactId,
                                tagsAdded: tags,
                                ...response 
                            } 
                        });
                    }

                    if (operation === 'remove') {
                        const contactId = this.getNodeParameter('contactId', i) as string;
                        const tagsString = this.getNodeParameter('tags', i) as string;
                        const tags = processTags(tagsString);

                        const requestOptions: IHttpRequestOptions = {
                            method: 'DELETE',
                            url: `${baseURL}/contacts/${contactId}/tags`,
                            body: {
                                tags,
                            },
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', requestOptions);
                        returnData.push({ 
                            json: { 
                                success: true,
                                contactId,
                                tagsRemoved: tags,
                                ...response 
                            } 
                        });
                    }

                    if (operation === 'replace') {
                        const contactId = this.getNodeParameter('contactId', i) as string;
                        const tagsString = this.getNodeParameter('tags', i) as string;
                        const tags = processTags(tagsString);

                        // First, get the current contact to remove all existing tags
                        const getOptions: IHttpRequestOptions = {
                            method: 'GET',
                            url: `${baseURL}/contacts/${contactId}`,
                            json: true,
                        };

                        const contactResponse = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', getOptions);
                        const existingTags = contactResponse.contact?.tags || [];

                        // Remove existing tags if any
                        if (existingTags.length > 0) {
                            const removeOptions: IHttpRequestOptions = {
                                method: 'DELETE',
                                url: `${baseURL}/contacts/${contactId}/tags`,
                                body: {
                                    tags: existingTags,
                                },
                                json: true,
                            };
                            await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', removeOptions);
                        }

                        // Add new tags
                        if (tags.length > 0) {
                            const addOptions: IHttpRequestOptions = {
                                method: 'POST',
                                url: `${baseURL}/contacts/${contactId}/tags`,
                                body: {
                                    tags,
                                },
                                json: true,
                            };
                            response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', addOptions);
                        }

                        returnData.push({ 
                            json: { 
                                success: true,
                                contactId,
                                previousTags: existingTags,
                                newTags: tags,
                                ...response 
                            } 
                        });
                    }

                    if (operation === 'bulkAdd' || operation === 'bulkRemove') {
                        const contactIdsString = this.getNodeParameter('contactIds', i) as string;
                        const tagsString = this.getNodeParameter('bulkTags', i) as string;
                        
                        const contactIds = contactIdsString.split(',').map(id => id.trim()).filter(id => id);
                        const tags = processTags(tagsString);

                        const method = operation === 'bulkAdd' ? 'POST' : 'DELETE';
                        const action = operation === 'bulkAdd' ? 'added' : 'removed';

                        // Process each contact
                        const results = [];
                        for (const contactId of contactIds) {
                            try {
                                const requestOptions: IHttpRequestOptions = {
                                    method,
                                    url: `${baseURL}/contacts/${contactId}/tags`,
                                    body: {
                                        tags,
                                    },
                                    json: true,
                                };

                                const result = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', requestOptions);
                                results.push({
                                    contactId,
                                    success: true,
                                    [`tags${action.charAt(0).toUpperCase() + action.slice(1)}`]: tags,
                                });
                            } catch (error) {
                                results.push({
                                    contactId,
                                    success: false,
                                    error: error.message,
                                });
                            }
                        }

                        returnData.push({ 
                            json: { 
                                operation,
                                totalContacts: contactIds.length,
                                successful: results.filter(r => r.success).length,
                                failed: results.filter(r => !r.success).length,
                                results,
                            } 
                        });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ 
                        json: { 
                            error: error.message,
                            details: error.response?.body || error.response?.data || 'No additional details'
                        } 
                    });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error);
            }
        }

        return [returnData];
    }
}
