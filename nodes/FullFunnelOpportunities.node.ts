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

export class FullFunnelOpportunities implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'FullFunnel Opportunities',
        name: 'fullFunnelOpportunities',
        icon: 'file:fullfunnel.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Gerenciar oportunidades/negócios na FullFunnel (GoHighLevel)',
        defaults: {
            name: 'FullFunnel Opportunities',
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
                        name: 'Opportunity',
                        value: 'opportunity',
                    },
                ],
                default: 'opportunity',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new opportunity',
                        action: 'Create an opportunity',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete an opportunity',
                        action: 'Delete an opportunity',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get an opportunity by ID',
                        action: 'Get an opportunity',
                    },
                    {
                        name: 'Get All',
                        value: 'getAll',
                        description: 'Get all opportunities',
                        action: 'Get all opportunities',
                    },
                    {
                        name: 'Search',
                        value: 'search',
                        description: 'Search opportunities by various criteria',
                        action: 'Search opportunities',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update an opportunity',
                        action: 'Update an opportunity',
                    },
                    {
                        name: 'Update Status',
                        value: 'updateStatus',
                        description: 'Update opportunity status',
                        action: 'Update opportunity status',
                    },
                ],
                default: 'create',
            },
            // Create Opportunity Fields
            {
                displayName: 'Pipeline ID',
                name: 'pipelineId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'The ID of the pipeline',
            },
            {
                displayName: 'Pipeline Stage ID',
                name: 'pipelineStageId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'The ID of the pipeline stage',
            },
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'The ID of the contact associated with this opportunity',
            },
            {
                displayName: 'Opportunity Name',
                name: 'name',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name of the opportunity',
                placeholder: 'Nova Venda - João Silva',
            },
            {
                displayName: 'Monetary Value',
                name: 'monetaryValue',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['create'],
                    },
                },
                default: 0,
                description: 'Monetary value of the opportunity',
                typeOptions: {
                    numberPrecision: 2,
                },
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Status',
                        name: 'status',
                        type: 'options',
                        options: [
                            {
                                name: 'Open',
                                value: 'open',
                            },
                            {
                                name: 'Won',
                                value: 'won',
                            },
                            {
                                name: 'Lost',
                                value: 'lost',
                            },
                            {
                                name: 'Abandoned',
                                value: 'abandoned',
                            },
                        ],
                        default: 'open',
                    },
                    {
                        displayName: 'Assigned To',
                        name: 'assignedTo',
                        type: 'string',
                        default: '',
                        description: 'User ID to assign the opportunity to',
                    },
                    {
                        displayName: 'Source',
                        name: 'source',
                        type: 'string',
                        default: '',
                        description: 'Source of the opportunity',
                        placeholder: 'Website, Facebook, Google Ads',
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
                    {
                        displayName: 'Notes',
                        name: 'notes',
                        type: 'string',
                        typeOptions: {
                            rows: 4,
                        },
                        default: '',
                        description: 'Additional notes about the opportunity',
                    },
                ],
            },
            // Get/Delete Opportunity Fields
            {
                displayName: 'Opportunity ID',
                name: 'opportunityId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['get', 'delete', 'update', 'updateStatus'],
                    },
                },
                default: '',
                description: 'The ID of the opportunity',
            },
            // Update Status Fields
            {
                displayName: 'New Status',
                name: 'newStatus',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['updateStatus'],
                    },
                },
                options: [
                    {
                        name: 'Open',
                        value: 'open',
                    },
                    {
                        name: 'Won',
                        value: 'won',
                    },
                    {
                        name: 'Lost',
                        value: 'lost',
                    },
                    {
                        name: 'Abandoned',
                        value: 'abandoned',
                    },
                ],
                default: 'open',
            },
            // Update Opportunity Fields
            {
                displayName: 'Update Fields',
                name: 'updateFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['update'],
                    },
                },
                options: [
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Monetary Value',
                        name: 'monetaryValue',
                        type: 'number',
                        default: 0,
                        typeOptions: {
                            numberPrecision: 2,
                        },
                    },
                    {
                        displayName: 'Pipeline ID',
                        name: 'pipelineId',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Pipeline Stage ID',
                        name: 'pipelineStageId',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Status',
                        name: 'status',
                        type: 'options',
                        options: [
                            {
                                name: 'Open',
                                value: 'open',
                            },
                            {
                                name: 'Won',
                                value: 'won',
                            },
                            {
                                name: 'Lost',
                                value: 'lost',
                            },
                            {
                                name: 'Abandoned',
                                value: 'abandoned',
                            },
                        ],
                        default: 'open',
                    },
                    {
                        displayName: 'Assigned To',
                        name: 'assignedTo',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Source',
                        name: 'source',
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
                    },
                ],
            },
            // Get All / Search Fields
            {
                displayName: 'Return All',
                name: 'returnAll',
                type: 'boolean',
                displayOptions: {
                    show: {
                        resource: ['opportunity'],
                        operation: ['getAll', 'search'],
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
                        resource: ['opportunity'],
                        operation: ['getAll', 'search'],
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
                        resource: ['opportunity'],
                        operation: ['getAll', 'search'],
                    },
                },
                options: [
                    {
                        displayName: 'Pipeline ID',
                        name: 'pipelineId',
                        type: 'string',
                        default: '',
                        description: 'Filter by pipeline ID',
                    },
                    {
                        displayName: 'Pipeline Stage ID',
                        name: 'pipelineStageId',
                        type: 'string',
                        default: '',
                        description: 'Filter by pipeline stage ID',
                    },
                    {
                        displayName: 'Status',
                        name: 'status',
                        type: 'options',
                        options: [
                            {
                                name: 'All',
                                value: 'all',
                            },
                            {
                                name: 'Open',
                                value: 'open',
                            },
                            {
                                name: 'Won',
                                value: 'won',
                            },
                            {
                                name: 'Lost',
                                value: 'lost',
                            },
                            {
                                name: 'Abandoned',
                                value: 'abandoned',
                            },
                        ],
                        default: 'all',
                    },
                    {
                        displayName: 'Assigned To',
                        name: 'assignedTo',
                        type: 'string',
                        default: '',
                        description: 'Filter by assigned user ID',
                    },
                    {
                        displayName: 'Contact ID',
                        name: 'contactId',
                        type: 'string',
                        default: '',
                        description: 'Filter by contact ID',
                    },
                    {
                        displayName: 'Date Range',
                        name: 'dateRange',
                        type: 'options',
                        options: [
                            {
                                name: 'All Time',
                                value: 'all',
                            },
                            {
                                name: 'Today',
                                value: 'today',
                            },
                            {
                                name: 'Yesterday',
                                value: 'yesterday',
                            },
                            {
                                name: 'Last 7 Days',
                                value: 'last7days',
                            },
                            {
                                name: 'Last 30 Days',
                                value: 'last30days',
                            },
                            {
                                name: 'This Month',
                                value: 'thisMonth',
                            },
                            {
                                name: 'Last Month',
                                value: 'lastMonth',
                            },
                        ],
                        default: 'all',
                    },
                    {
                        displayName: 'Query',
                        name: 'query',
                        type: 'string',
                        default: '',
                        description: 'Search query',
                        displayOptions: {
                            show: {
                                '/operation': ['search'],
                            },
                        },
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
                if (resource === 'opportunity') {
                    let response: any;

                    if (operation === 'create') {
                        const pipelineId = this.getNodeParameter('pipelineId', i) as string;
                        const pipelineStageId = this.getNodeParameter('pipelineStageId', i) as string;
                        const contactId = this.getNodeParameter('contactId', i) as string;
                        const name = this.getNodeParameter('name', i) as string;
                        const monetaryValue = this.getNodeParameter('monetaryValue', i) as number;
                        const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                        const body: IDataObject = {
                            pipelineId,
                            pipelineStageId,
                            contactId,
                            name: name || `Opportunity - ${new Date().toISOString()}`,
                            monetaryValue,
                            locationId,
                        };

                        // Add additional fields
                        if (additionalFields.status) body.status = additionalFields.status;
                        if (additionalFields.assignedTo) body.assignedTo = additionalFields.assignedTo;
                        if (additionalFields.source) body.source = additionalFields.source;
                        if (additionalFields.notes) body.notes = additionalFields.notes;
                        
                        // Handle tags
                        if (additionalFields.tags) {
                            body.tags = additionalFields.tags.toString().split(',').map(tag => tag.trim());
                        }
                        
                        // Handle custom fields
                        if (additionalFields.customFields) {
                            try {
                                const customFields = typeof additionalFields.customFields === 'string' 
                                    ? JSON.parse(additionalFields.customFields) 
                                    : additionalFields.customFields;
                                body.customFields = customFields;
                            } catch (e) {
                                throw new Error('Invalid JSON in custom fields');
                            }
                        }

                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: `${baseURL}/opportunities`,
                            body,
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.opportunity || response });
                    }

                    if (operation === 'get') {
                        const opportunityId = this.getNodeParameter('opportunityId', i) as string;

                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `${baseURL}/opportunities/${opportunityId}`,
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.opportunity || response });
                    }

                    if (operation === 'getAll' || operation === 'search') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const limit = this.getNodeParameter('limit', i, 50) as number;
                        const filters = this.getNodeParameter('filters', i) as IDataObject;

                        const qs: IDataObject = {
                            locationId,
                            limit: returnAll ? 100 : limit,
                        };

                        // Add filters
                        if (filters.pipelineId) qs.pipelineId = filters.pipelineId;
                        if (filters.pipelineStageId) qs.pipelineStageId = filters.pipelineStageId;
                        if (filters.status && filters.status !== 'all') qs.status = filters.status;
                        if (filters.assignedTo) qs.assignedTo = filters.assignedTo;
                        if (filters.contactId) qs.contactId = filters.contactId;
                        if (filters.query) qs.query = filters.query;

                        // Handle date range
                        if (filters.dateRange && filters.dateRange !== 'all') {
                            const now = new Date();
                            let startDate: Date;
                            
                            switch (filters.dateRange) {
                                case 'today':
                                    startDate = new Date(now.setHours(0, 0, 0, 0));
                                    break;
                                case 'yesterday':
                                    startDate = new Date(now.setDate(now.getDate() - 1));
                                    startDate.setHours(0, 0, 0, 0);
                                    break;
                                case 'last7days':
                                    startDate = new Date(now.setDate(now.getDate() - 7));
                                    break;
                                case 'last30days':
                                    startDate = new Date(now.setDate(now.getDate() - 30));
                                    break;
                                case 'thisMonth':
                                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                                    break;
                                case 'lastMonth':
                                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                    break;
                                default:
                                    startDate = new Date(0);
                            }
                            
                            qs.startDate = startDate.toISOString();
                        }

                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `${baseURL}/opportunities${operation === 'search' ? '/search' : ''}`,
                            qs,
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        
                        const opportunities = response.opportunities || [];
                        
                        if (returnAll && opportunities.length === 100) {
                            // Implement pagination
                            let allOpportunities = [...opportunities];
                            let offset = 100;
                            
                            while (offset < 500) { // Limit to prevent infinite loops
                                qs.offset = offset;
                                const nextResponse = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', {
                                    ...options,
                                    qs,
                                });
                                const nextOpportunities = nextResponse.opportunities || [];
                                if (nextOpportunities.length === 0) break;
                                allOpportunities.push(...nextOpportunities);
                                offset += 100;
                            }
                            
                            returnData.push(...allOpportunities.map((opp: IDataObject) => ({ json: opp })));
                        } else {
                            returnData.push(...opportunities.slice(0, limit).map((opp: IDataObject) => ({ json: opp })));
                        }
                    }

                    if (operation === 'update') {
                        const opportunityId = this.getNodeParameter('opportunityId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

                        const body: IDataObject = {};

                        // Add update fields
                        if (updateFields.name) body.name = updateFields.name;
                        if (updateFields.monetaryValue !== undefined) body.monetaryValue = updateFields.monetaryValue;
                        if (updateFields.pipelineId) body.pipelineId = updateFields.pipelineId;
                        if (updateFields.pipelineStageId) body.pipelineStageId = updateFields.pipelineStageId;
                        if (updateFields.status) body.status = updateFields.status;
                        if (updateFields.assignedTo) body.assignedTo = updateFields.assignedTo;
                        if (updateFields.source) body.source = updateFields.source;
                        
                        // Handle tags
                        if (updateFields.tags) {
                            body.tags = updateFields.tags.toString().split(',').map(tag => tag.trim());
                        }
                        
                        // Handle custom fields
                        if (updateFields.customFields) {
                            try {
                                const customFields = typeof updateFields.customFields === 'string' 
                                    ? JSON.parse(updateFields.customFields) 
                                    : updateFields.customFields;
                                body.customFields = customFields;
                            } catch (e) {
                                throw new Error('Invalid JSON in custom fields');
                            }
                        }

                        const options: IHttpRequestOptions = {
                            method: 'PUT',
                            url: `${baseURL}/opportunities/${opportunityId}`,
                            body,
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: response.opportunity || response });
                    }

                    if (operation === 'updateStatus') {
                        const opportunityId = this.getNodeParameter('opportunityId', i) as string;
                        const newStatus = this.getNodeParameter('newStatus', i) as string;

                        const body: IDataObject = {
                            status: newStatus,
                        };

                        const options: IHttpRequestOptions = {
                            method: 'PUT',
                            url: `${baseURL}/opportunities/${opportunityId}/status`,
                            body,
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ 
                            json: { 
                                success: true,
                                opportunityId,
                                newStatus,
                                ...response 
                            } 
                        });
                    }

                    if (operation === 'delete') {
                        const opportunityId = this.getNodeParameter('opportunityId', i) as string;

                        const options: IHttpRequestOptions = {
                            method: 'DELETE',
                            url: `${baseURL}/opportunities/${opportunityId}`,
                            json: true,
                        };

                        response = await this.helpers.requestWithAuthentication.call(this, 'fullFunnelApi', options);
                        returnData.push({ json: { success: true, opportunityId } });
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
