from pydantic import BaseModel, ConfigDict


class AreaBase(BaseModel):
    id: int
    name: str
    parent_id: int = 0
    sort_order: int = 0

    model_config = ConfigDict(from_attributes=True)


class AreaResponse(AreaBase):
    pass
