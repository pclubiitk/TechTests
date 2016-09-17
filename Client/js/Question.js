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
    if(alternatives && (qtype=="multians" || qtype=="singleans")) this.alternatives = alternatives;
    if((alternatives && (qtype=="multians" || qtype=="singleans")) && alteradd) this.alteradd = true;
  }

Question.prototype.getType = function() {
  if(this.qtype=="singleans") return "Single Answer";
  if(this.qtype=="multians") return "Multiple Answer";
  if(this.qtype=="subjective") return "Subjective";
  if(this.qtype=="codebased") return "Code Based";
  return "Invlid Type";
}
