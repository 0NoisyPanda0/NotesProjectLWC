/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-15-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class accountNotesController {
        
    @AuraEnabled
    public static List<Note> getNotes(string accountId) {

        Set<Id> contactIds = new Set<Id>();
        List<Contact> contactList = new List<Contact>([SELECT Id FROM Contact WHERE AccountId = :accountId]);
        for(Contact c : contactList){
            contactIds.add(c.Id);
        }

        return [SELECT Id, Title, Body, CreatedBy.Name, Parent.Type FROM Note
        WHERE Parent.Id = :accountId OR Parent.Id IN :contactIds];
    }

    @AuraEnabled 
    public static String getPdfFileAsBase64String() {
        PageReference pdfPage = Page.notes;
        Blob pdfBlob = pdfPage.getContent();
        String base64Pdf = EncodingUtil.base64Encode(pdfBlob);
        return base64Pdf;
    }
}
