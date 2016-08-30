function Question(statement, qtype, alternatives, alteradd) {
    this.statement = statement;
    this.qtype = qtype;
    /*
    Question types can be the following:
    1. Single Answer(singleans)
    2. Multiple Answer(multians)
    3. Subjective(subjective)
    4. Code Based(codebased)
    alteradd can be set to true if we want to enable adding options. 
    */
    if(alternatives) this.alternatives = alternatives;
    if(alternatives && alteradd) this.alteradd = true;
  }
