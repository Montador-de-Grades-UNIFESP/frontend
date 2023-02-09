import pandas as pd

class Modeling():

    def __init__(self):
        colnames=['NOME', "DIA", "TURMA/PROFESSOR", "HORARIO"]
        data = pd.read_csv("database/ucs.csv", encoding="utf-8", sep=";", names=colnames, header=None)

        self.ucs = pd.DataFrame(data)

        self.ucs = self.ucs[self.ucs["NOME"] != " "]

        self.ucs.loc[~self.ucs["TURMA/PROFESSOR"].str.contains("-"), "TURMA/PROFESSOR"] = "0-" + self.ucs.loc[~self.ucs["TURMA/PROFESSOR"].str.contains("-"), "TURMA/PROFESSOR"].astype(str)
        self.ucs["TURMA/PROFESSOR"] = self.ucs["TURMA/PROFESSOR"].str.replace(" - ", "-").str.split("-")
        self.ucs["TURMA"] = self.ucs["TURMA/PROFESSOR"].str[0].str.strip()

        self.ucs["PROFESSORES"] = self.ucs["TURMA/PROFESSOR"].str[1].str.replace(" / ", "/").str.strip()

        self.ucs["HORARIO"] = self.ucs["HORARIO"].str.replace(" - ", "-").str.strip()
        self.ucs.loc[self.ucs["HORARIO"].str.contains("8h00-10h00"), "HORARIO"] = "0" + self.ucs.loc[self.ucs["HORARIO"].str.contains("8h00-10h00"), "HORARIO"].astype(str)
        self.ucs.loc[self.ucs["DIA"].str.contains("Segunda"), "DIA"] = self.ucs.loc[self.ucs["DIA"].str.contains("Segunda"), "DIA"].str.replace(" feira", "")

        self.ucs.drop(["TURMA/PROFESSOR"], axis=1, inplace=True)

        gp_ucs = self.ucs.groupby(["NOME", "TURMA", "PROFESSORES"], as_index=False)["DIA"].count()
        gp_ucs = gp_ucs.sort_values(by=["NOME"]).reset_index()
        gp_ucs = gp_ucs.drop("DIA", axis=1)
        gp_ucs["ID"] = gp_ucs.index

        self.ucs = self.ucs.merge(gp_ucs, on=["NOME", "TURMA", "PROFESSORES"], how="outer")
        self.ucs = self.ucs[["ID", "NOME", "TURMA", "PROFESSORES", "DIA", "HORARIO"]]

    def _df_to_dict(df):
        return df.to_dict("records")

    def _group_by(df):
        return df.groupby(["ID", "NOME", "TURMA", "PROFESSORES"], as_index=False).\
        agg({"DIA":lambda x: list(x), "HORARIO":lambda x: list(x)})

    def get_ucs(self):
        return Modeling._df_to_dict(Modeling._group_by(self.ucs))

    def uc_analizer(self, data):
        sub_ucs = self.ucs.loc[self.ucs["ID"].isin(data), ["DIA", "HORARIO"]]
        sub_ucs = self.ucs.merge(sub_ucs, how='outer', indicator=True)
        result = sub_ucs.loc[sub_ucs["_merge"] == "both", "ID"].unique()
        return Modeling._df_to_dict(Modeling._group_by(self.ucs[~self.ucs["ID"].isin(result)]))