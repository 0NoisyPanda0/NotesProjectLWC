/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-10-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AllAccountsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        List<Account> accountList = [SELECT Id, Name FROM Account];
        return accountList;
    }

}
