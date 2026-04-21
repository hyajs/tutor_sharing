from pydantic import BaseModel, ConfigDict


class SchoolBase(BaseModel):
    id: int
    name: str
    city: str = None
    type: str = "university"
    sort_order: int = 0

    model_config = ConfigDict(from_attributes=True)


class SchoolResponse(SchoolBase):
    pass
