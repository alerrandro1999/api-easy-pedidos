select COALESCE(max(Item),0)+1 as Numero  from PREITENS
where COD_FILIAL = cODIGO na tabela cadastro do usuario que tá logado
and and CODPREVENDA = codigo da venda na tabela prevendas


UPDATE OR INSERT INTO PREITENS (COD_FILIAL, CODPREVENDA,  ITEM,COD_PRODUTO,Cod_Vendedor,QUANTIDADE, PRECO_CUSTO,VALOR_TOTAL,PRECO_VENDA, Preco_Final,Origem,Modalidade_ICMS,CFOP,CST_ICMS,BASE_ICMS,RED_BASE_ICMS,PORC_ICMS,VALOR_ICMS, MODALIDADE_ICMSST,BASE_ICMSST,RED_BASE_ICMSST, PORC_MVA,PORC_ICMSST, VALOR_ICMSST, CST_IPI, VALOR_IPI, PORC_IPI,CST_PIS, VALOR_PIS, PORC_PIS ,CST_Cofins, VALOR_Cofins, PORC_Cofins,PRODUTO,PRECO_DESCONTO)VALUES( cODIGO na tabela cadastro do usuario que tá logado+  , 
codigo da tabela prevenda+  , 
Codigo do primeiro select item+  , 
CODIGO DO PRODUDO+  , 
codigo do usuario que  logou CODIGO+  , 
 QUANTIDADE EM NUMEROS EXEMPLO(10.00)  , 
0+  , 
0+  , 
0+  , 
0+ ,  
0+  , 
0+  , 
5102+  , 
102+  , 
0+  , 
0+  , 
0+  , 
0+  , 
0+  , 
0+  , 
0+  , 
0+  , 
0+  , 
0+  , 
 
0+  , 
0+  , 
0+  , 

0+  , 
0+  , 
0+  , 

0+  , 
0+  , 
0+  , 
nOME DO PRODUTO +  , 
0+  ) 