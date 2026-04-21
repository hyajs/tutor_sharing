from pydantic import BaseModel, ConfigDict


class SubjectBase(BaseModel):
    id: int
    name: str
    parent_id: int = 0
    level: int = 1

    model_config = ConfigDict(from_attributes=True)


class SubjectResponse(SubjectBase):
    pass
