/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-16-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class accountforVF {

    //Hardcode ID just for demo purpose
    public final string accIdVF = '0018V00002PQIoaQAH';
    //public string accIdVF = '';

    @AuraEnabled(cacheable=true)
    public static string getAccountIdVF(string accountId){
        return accountId;
    }

    //@AuraEnabled
    public Account getAccountsVF(){
        return [SELECT Id, Name FROM Account WHERE Id = :accIdVF LIMIT 1];
    }

    //@AuraEnabled
    public List<Note> getNotesVF() {
        Set<Id> contactIds = new Set<Id>();
        List<Contact> contactList = new List<Contact>([SELECT Id FROM Contact WHERE AccountId = :accIdVF]);
        for(Contact c : contactList){
            contactIds.add(c.Id);
        }

        return [SELECT Id, Title, Body, CreatedBy.Name, Parent.Type FROM Note
        WHERE Parent.Id = :accIdVF OR Parent.Id IN :contactIds];
    }
}
