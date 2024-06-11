﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


#nullable enable
using JetBrains.Annotations;

namespace BackendConfiguration.Pn.Services.BackendConfigurationPropertiesService;

using Infrastructure.Helpers;
using Infrastructure.Models.Properties;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IBackendConfigurationPropertiesService
{
    Task<OperationDataResult<Paged<PropertiesModel>>> Index(PropertiesRequestModel request);
    Task<OperationResult> Create(PropertyCreateModel createModel);
    Task<OperationDataResult<PropertiesModel>> Read(int id);
    Task<OperationResult> Update(PropertiesUpdateModel updateModel);
    Task<OperationResult> Delete(int id);
    Task<OperationDataResult<List<CommonDictionaryModel>>> GetCommonDictionary(bool fullNames);
    Task<OperationDataResult<Result>> GetCompanyType(int number);
    Task<OperationDataResult<ChrResult>> GetChrInformation(int number);
    Task<OperationDataResult<List<CommonDictionaryModel>>> GetLinkedFoldersList(int propertyId);
    Task<OperationDataResult<List<CommonDictionaryModel>>> GetLinkedFoldersList(List<int> propertyIds);
    Task<OperationDataResult<List<PropertyFolderModel>>> GetLinkedFolderDtos(int propertyId);
    Task<OperationDataResult<List<PropertyFolderModel>>> GetLinkedFolderDtos(List<int> propertyIds);
    Task<OperationDataResult<List<CommonDictionaryModel>>> GetLinkedSites(int? propertyId, bool compliance);
    Task<OperationDataResult<List<CommonDictionaryModel>>> GetLinkedSites(List<int>? propertyId);
}