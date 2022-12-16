using System.Collections.Generic;
using Microting.EformBackendConfigurationBase.Infrastructure.Data.Entities;
using Microting.EformBackendConfigurationBase.Infrastructure.Enum;

namespace BackendConfiguration.Pn.Messages;

public class WorkOrderUpdated
{
    public List<KeyValuePair<int, int>> PropertyWorkers { get; set; }
    public int EformId;
    public int PropertyId;
    public string Description;
    public CaseStatusesEnum Status;
    public int WorkorderCaseId;
    public string NewDescription;
    public int? DeviceUsersGroupId;
    public string PdfHash;
    public string SiteName;
    public string PushMessageBody;
    public string PushMessageTitle;
    public string UpdatedByName;

    public WorkOrderUpdated(List<KeyValuePair<int, int>> propertyWorkers, int eformId, int propertyId, string description, CaseStatusesEnum status, int workorderCaseId, string newDescription, int? deviceUsersGroupId, string pdfHash, string siteName, string pushMessageBody, string pushMessageTitle, string updatedByName)
    {
        PropertyWorkers = propertyWorkers;
        EformId = eformId;
        PropertyId = propertyId;
        Description = description;
        Status = status;
        WorkorderCaseId = workorderCaseId;
        NewDescription = newDescription;
        DeviceUsersGroupId = deviceUsersGroupId;
        PdfHash = pdfHash;
        SiteName = siteName;
        PushMessageBody = pushMessageBody;
        PushMessageTitle = pushMessageTitle;
        UpdatedByName = updatedByName;
    }
}