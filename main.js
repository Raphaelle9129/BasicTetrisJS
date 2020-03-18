var rot=[[0,-1],[1,0]];
var id=[[1,0],[0,1]];
var vect=[[2],[1]];
var last=[];
var current=[];
var relatCurr=[];
var colAct=""
var Y=0;
var X=0;
var board=[];
var score=0;tresh=0;lvl=0;cntDown=0;
var speed=0;
var fast=false;
var last4=[];

var colors=["Ros","Or","Blu","LitBlu","Red","Jo","Gre"];

var pieces={LitBlu:[[[0],[0]],[[1],[0]],[[2],[0]],[[3],[0]]],
			Blu:[[[0],[0]],[[1],[0]],[[2],[0]],[[2],[1]]],
			Or:[[[0],[0]],[[1],[0]],[[2],[0]],[[0],[1]]],
			Jo:[[[0],[0]],[[1],[0]],[[0],[1]],[[1],[1]]],
			Ros:[[[0],[0]],[[1],[0]],[[2],[0]],[[1],[1]]],
			Red:[[[0],[0]],[[1],[0]],[[1],[1]],[[2],[1]]],
			Gre:[[[0],[0]],[[1],[0]],[[0],[1]],[[-1],[1]]]}
			
var nPieces={LitBlu:0,Blu:0,Or:0,Jo:0,Ros:0,Red:0,Gre:0};

var multi=function(A,v){
	
	var ligneV=v.length;
	var colV=v[0].length;
	var ligneA=A.length;
	var colA=A[0].length;
	
	if (colA!=ligneV) return false;
	
	var result=[];
	
	for (var i=0;i<ligneA;i++){		
		ligneTemp=[];
		
		for (var j=0; j<colV;j++){			
			ligneTemp.push(0);
			
			for (var n=0; n<colA;n++){				
				ligneTemp[ligneTemp.length-1]+=(A[i][n])*(v[n][j]);				
			}			
		}		
		result.push(ligneTemp);	
		}
	return result;
};

var transImg=function(img,A,k){
	if (k==0)return img;
	result=[];
	for (var i=0; i<img.length;i++){
		result.push(multi(A,img[i]));
	}
	if (k!=1){
		result=transImg(result,A,k-1).slice();
	}
	return result;
};

var constructTable=function(h,l){//Enlever tableau true/false
	
	var bod=document.getElementById("1");	
	var table="<table style=\"border-collapse:collapse; border-spacing=0px;\">";
	var boardTemp=Array(l).fill("none");
	var nBoard=[];
	
	for (var i=0; i<h;i++){
		nBoard.push(boardTemp.slice());
	}
	
	for (var i=0;i<h;i++){		
		table+="<tr>";
		
		for (var j=0; j<l; j++){
			table+="<td id=\""+i+"-"+j+"\" style=\"background:gray; display:inline-block; width:30px; height:30px;\" ><img src=\"Back.jpg\"></img></td>";
		}
		if (i==0){
			table+="<td id=\"score\"><b>  score: 0</b></td>";
		}else if (i==1){
			table+="<td id=\"lvl\"><b>  niveau: 1</b></td>"
		}else if (i==2){
			table+="<td id=\"tresh\"><b>  prochain: 5</b></td>"
		}
		table+="</tr>"
	}
	table+="</table>"
	bod.innerHTML+=table;
	return nBoard;
};

var affichePiece=function(img,name,x,y){
	
	for (var i=0; i<img.length;i++){
		if (y+img[i][1][0]>-1){
			document.getElementById(""+(y+img[i][1][0])+"-"+(x+img[i][0][0])).innerHTML="<img src=\"Tile"+name+".jpg\"></img>"		
		}
	}	
};

var reset=function(trail){
	
	document.getElementById(trail[1]+"-"+trail[0]).innerHTML="<img src=\"Back.jpg\"></img>";
	
};

var refresh=function(end){//Enlever tableau true/false
	
	last=current.slice();
	for (var i=0;i<last.length;i++){
		if (!end && last[i][1][0]>=0){
			reset(last[i]);
			board[last[i][1][0]][last[i][0][0]]="none";
		}
	}
	
	current=[];
	
	for (var i=0; i<relatCurr.length;i++){		
		current.push([[relatCurr[i][0][0]+X],[relatCurr[i][1][0]+Y]]);
		if (end){
			board[current[i][1][0]][current[i][0][0]]=colAct;
		}
	}
};

var creerPiece=function(){//UNFINISHED
	
	current=[];
	
	for (var i=0; i<4; i++){
		colAct=colors[Math.floor(Math.random()*7)];
		if (last4.indexOf(colAct)==-1){
			break;
		}
	}
	nPieces[colAct]+=1;
	if (last4.unshift(colAct)>3){
		last4.pop();
	}
	last=[];
	relatCurr=pieces[colAct];
	X=3;
	Y=-1;
	nouv=true;
	
};

var getExtreme=function(tab){
	
	var minX=Infinity;
	var maxX=0;
	var maxY=0;
	var minY=Infinity;
	var minXy=0;
	
	for (var i=0;i<tab.length;i++){
			
			if(tab[i][0][0]<minX){
				minX=tab[i][0][0];
				minXy=tab[i][1][0];				
			}
			if(tab[i][0][0]>maxX){
				maxX=tab[i][0][0]; 
			}
			if(tab[i][1][0]>maxY){
				maxY=tab[i][1][0]; 
			}
			if (tab[i][1][0]<minY){
				minY=tab[i][1][0];
			}
		}
	return [minX,maxX,maxY,minY,minXy];
};

var keyAct=function(event){//nouvelle? a enlever
	
	var keyPr=event.key;
if (keyPr=="w" || keyPr=="a" || keyPr=="d" || keyPr=="s"){
		
		var extreme=getExtreme(current);
		
		if (keyPr=="d"){
			
			var touch=false;
			for (var i=0; i<current.length;i++){
				if (current[i][1][0]>=0 && board[current[i][1][0]][(current[i][0][0]+1)]!="none"){
					touch=true;
				}
			}
			
			if (extreme[1]<9 && !touch){
				X++;
				refresh(false);
				affichePiece(relatCurr,colAct,X,Y);
			}
		
		}else if(keyPr=="a"){
		
      		var touch=false;
			
			for (var i=0; i<current.length;i++){
				if (current[i][1][0]>=0 && board[current[i][1][0]][(current[i][0][0]-1)]!="none"){
					touch=true;
				}
			}
		
			if (extreme[0]>0 && !touch){
				X--;
				refresh(false);
				affichePiece(relatCurr,colAct,X,Y);
			}
		
		}else if(keyPr=="w"){
			
			var ext1=getExtreme(relatCurr);
			relatCurr=transImg(relatCurr,rot,1).slice();
			var ext2=getExtreme(relatCurr);
			var delY=ext2[2]-ext1[2];
			Y-=delY;
			var delX=ext2[0]-ext1[0];
			X-=delX;
			var px=0;
			var py=0;
			
			var notOkay=false;
			
			do{
				
				notOkay=false;
				
				for(var i=0; i<relatCurr.length; i++){
					
					px=relatCurr[i][0][0]+X;
					py=relatCurr[i][1][0]+Y;
					
					if (py>=0 && board[py][px]!="none" || px>9){
						notOkay=true;
					}					
				}
				
				if (notOkay){
					
					ext=getExtreme(relatCurr);//[minX,maxX,maxY,minY]
					
					if ((ext[0]+X)==0 || (ext[0]+X-1)>0 && board[(ext[4]+Y)][ext[0]+X-1]!="none"){
						console.log(ext[4]+Y);
						console.log((ext[0]+X-1));
						console.log();
						
						Y--;
					}else{
						X--;
					}
					
				}
				
			}while (notOkay);
			
			refresh(false);
			
			affichePiece(relatCurr,colAct,X,Y);
		
		}else if(keyPr=="s"){
		
			fast=true;
			test2(false);
		
		}
	}
};

var deFast=function(event){
	if (event.key=="s"){
		fast=false;
	}
};

var movShit=function(y){
	
	for (var i=y;i>0;i--){
		board[i]=board[i-1].slice();
		for (var j=0;j<board[i].length;j++){
			if (board[i][j]!="none"){
				document.getElementById(i+"-"+j).innerHTML="<img src=\"Tile"+board[i][j]+".jpg\"></img>";
			}else{
				reset([[j],[i]]);
			}
		}
	}
	board[0]=Array(board[0].length).fill("none").slice();
	
};

var sleepDeg=function(milli){
	
	var init=new Date().getTime();
	for (var i=0; i<1e7;i++){
		if(new Date().getTime()-init>milli){
			break;
		}
	}	
};

var test3=function(){
	
	board=constructTable(20,10);
	creerPiece();
	lvl=1
	tresh=5;
	cntDown=5;
	speed=1010;
	test2(true);
	
};

var test2=function(fasting){	
	
	if (fast){
		score+=lvl;
		document.getElementById("score").innerHTML="<b>  score: "+score+"</b>";
	}
	
	Y++
	var touch=false;
	
	for (var i=0;i<current.length;i++){		
		if (current[i][1][0]+1>19||(Y<20 && current[i][1][0]+1>=0 && board[current[i][1][0]+1][current[i][0][0]]!="none")){			
			touch=true;
		}		
	}
	
	if (touch){
		Y--;
		for (var i=0; i<current.length;i++){
			if (current[i][1][0]<0){
				alert("perdu");
				console.log(nPieces);
				return;
			}
		}
		refresh(true);
		
		var ext=getExtreme(current);
		var pot=(ext[2]-ext[3]+1);
		var trueLigne=false;
		for (var k=0;k<(ext[2]-ext[3]+1);k++){

			var ligne=true;
			
			
			for (var j=0;j<board[Y].length;j++){
				
				if (board[ext[3]+k][j]=="none"){

					ligne=false;
					pot--;
					break;
				}
			}
			
			if(ligne){
				trueLigne=true;
				for (var j=0;j<board[Y].length;j++){
					//document.getElementById((ext[3]+k)+"-"+j).innerHTML="<img src=\"tileScore.jpg\"></img>";
		
				}
				movShit(ext[3]+k);
			}
			
		}
		
		if (trueLigne){
			
			switch (pot){
				case 1:score+=40*lvl;break;
				case 2:score+=100*lvl;break;
				case 3:score+=300*lvl;break;
				case 4:score+=1200*lvl;break;
			}
			cntDown-=pot;
			if (cntDown<=0){
				lvl++;
				tresh+=3;
				cntDown+=tresh;
				speed-=100;
			}
			document.getElementById("score").innerHTML="<b>  score: "+score+"</b>";
			document.getElementById("lvl").innerHTML="<b>  niveau: "+lvl+"</b>";
			document.getElementById("tresh").innerHTML="<b>  prochain: "+cntDown+"</b>";
		}
		
		creerPiece();
		refresh(false);
		refresh(false);
		affichePiece(relatCurr,colAct,X,Y);
		
	}else{
	
		refresh(false);
		affichePiece(relatCurr,colAct,X,Y);
	}
	if (fasting){
		setTimeout(function(){test2(true)},speed);
	}
};