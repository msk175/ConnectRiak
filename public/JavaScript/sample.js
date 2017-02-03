function checkStoreValue(){
	var val1=document.getElementById("acc_number").value;
	var val=document.getElementById("customer_id").value;
	if(val1&&val){
		return true;
	}else{
		alert("Please fill Kay value and customer id to continue");
		return false;
	}
}

function checkFetchValue(){
	var val1=document.getElementById("acc_numbers").value;
	//var val=document.getElementById("customer_id").value;
	if(val1){
		 document.getElementById("BDEFormID").method='POST';
        document.getElementById("BDEFormID").action="/fetchValue";
        document.getElementById("BDEFormID").submit();
	}else{
		alert("Please fill Kay value to continue");
		return false;
	}
}